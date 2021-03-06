import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TicketContent } from './TicketContent';
import { PAGE_SIZE } from '@fed-exam/config';

import 'bootstrap/dist/css/bootstrap.min.css';

export type AppState = {
	tickets?: Ticket[],
	ticketCount: number,
	ticketsPerPage: number,
	currentPage: number,
	search: string,
	superSearch: boolean,
	sort: string,
	ascending: boolean
}

const api = createApiClient();
const paginationLimit = 4;

export const sortTypes = ['date', 'title', 'email'];

interface IPageButtonProps {
	parent: App,
	pageNum: number,
	content?: string,
}

class PageButton extends React.Component<IPageButtonProps, {}> {
	render() {
		const pageNum = this.props.pageNum;
		const content = this.props.content;
		const parent  = this.props.parent;
		return (<li className={`page-item ${(parent.state.currentPage === pageNum) && !content ? "active" : ""}`}>
					<button className="page-link"
							onClick={() => parent.changePage(1)}>
						{content ? content : pageNum}
					</button>
				</li>);
	}
}
export class App extends React.Component<{}, AppState> {

	state: AppState = {
		ticketCount: 0,
		ticketsPerPage: PAGE_SIZE,
		currentPage: 1,
		search: '',
		superSearch: false,
		sort: 'none',
		ascending: true
	}

	searchDebounce: any = null;

	async componentDidMount() {
		await this.updateTickets();
	}

	editTitle = async (ticketId: string) => {
		let ticket = this.state.tickets?.find(t => t.id === ticketId);
		let newtitle = prompt("Title rename", ticket?.title);

		if (ticket && newtitle && ticket.title !== newtitle) {
			ticket.title = newtitle;
			await api.updateTicket(ticket);
			this.updateTickets();
		}
	}

	onSearch = async (val: string) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			}, this.updateTickets);
		}, 300);
	}
	
	/* State update callback, fetch tickets according to the new state */
	updateTickets = async () => {
		let result = await api.getTickets(this.state)
		this.setState({
			tickets: result.tickets,
			ticketCount: result.count
		});
	}

	getTicketCount = () => {
		return this.state.ticketCount;
	}

	changeSort = async (type: string) => {
		if (type === this.state.sort)
			this.setState({ascending: !this.state.ascending}, this.updateTickets)
		else
			this.setState({sort: type, ascending: false}, this.updateTickets);
	}

	changePage = (pageNum: number) => {
		if (this.state.currentPage === pageNum)
			return;

		this.setState({currentPage: pageNum}, this.updateTickets);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			<div className="btn-group">
			{sortTypes.map((type) => <button key={type}
											 className={`sortbtn btn ${this.state.sort === type ? 'btn-dark' : 'btn-light'} btn-sm`}
											 onClick={(_) => this.changeSort(type)}>
										Sort by {type}
									 </button>)}
			</div>
			<div>
			&nbsp;Advanced options
			<br/>
			&nbsp;Tickets per page:&nbsp;
			<input type="number" className="page-size"
					value={this.state.ticketsPerPage}
					onChange={(e) => this.setState({ticketsPerPage: Number(e.target.value)}, this.updateTickets)}/>&nbsp;
			<input type="checkbox"
				   checked={this.state.superSearch}
				   onChange={() => this.setState({superSearch: !this.state.superSearch}, this.updateTickets)}/>&nbsp;Super Search (disables sorting and advanced filtering)
			</div>
			{tickets ? <div className='results'>Showing {tickets.length} results out of {this.getTicketCount()} total tickets.</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<nav>
				{this.renderPageLinks()}
			</nav>
		</main>)
	}

	renderTickets = (tickets: Ticket[]) => {
		return (<ul className='tickets'>
			{tickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<button className="btn btn-info btn-sm" onClick={(_) => this.editTitle(ticket.id)}>Rename</button>
				<TicketContent content={ticket.content}/>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					{ticket.labels ? this.renderLabels(ticket.labels) : null }
				</footer>
			</li>))}
		</ul>);
	}

	renderLabels = (labels: string[]) => {
		return (<div className="labels">
			{labels.map((label) => (
				<span key={label} className="label">{label}</span> 
			))}
		</div>);
	}

	renderPageLinks = () => {
		const curr = this.state.currentPage;
		const pageCount = Math.ceil(this.getTicketCount() / this.state.ticketsPerPage);

		let pageNumbers = [...Array(pageCount).keys()].map(i => i + 1);

		/* Always have buttons for first and last pages*/
		const maxPage = pageNumbers.pop() as number;
		pageNumbers.shift();
		pageNumbers = pageNumbers.filter(i => i > (curr - paginationLimit) && (i < curr + paginationLimit));

		let content1 = (<ul className='pagination justify-content-center'>
							<li key={1} className={`page-item ${(curr === 1) ? "active" : ""}`}>
								<button className="page-link"
										onClick={() => this.changePage(1)}>
									{1}
								</button>
							</li>
							{curr > paginationLimit + 1 ?
							<li key="prev" className="page-item">
								<button className="page-link"
										onClick={() => this.changePage(curr - 1)}>
									&lt;&lt;
								</button>
							</li>
							: null}
							{pageNumbers.length >= 1 ?
							pageNumbers.map((item) => (<li key={item} className={`page-item ${(curr === item) ? "active" : ""}`}>
								<button className="page-link"
										onClick={() => this.changePage(item)}>
									{item}
								</button>
							</li>))
							: null}
							{curr < pageCount - paginationLimit ?
							<li key="next" className="page-item">
								<button className="page-link"
										onClick={() => this.changePage(curr + 1)}>
									&gt;&gt;
								</button>
							</li>
							: null}
							{maxPage !== 1 ?
							<li key={maxPage} className={`page-item ${(curr === maxPage) ? "active" : ""}`}>
								<button className="page-link"
										onClick={() => this.changePage(maxPage)}>
									{maxPage}
								</button>
							</li>
							: null}
					  </ul>);
		let content2 = (<ul className='pagination justify-content-center'>
							<PageButton pageNum={1} parent={this}/>
							{curr > paginationLimit + 1 ?
							<PageButton pageNum={curr - 1} content={"<<"} parent={this}/>
							: null}
							{pageNumbers.length >= 1 ?
							pageNumbers.map((item) => (<PageButton key={item} pageNum={item} parent={this}/>))
							: null}
							{curr < pageCount - paginationLimit ?
							<PageButton pageNum={curr + 1} content={">>"} parent={this}/>
							: null}
							{maxPage !== 1 ?
							<PageButton pageNum={maxPage} parent={this}/>
							: null}
					</ul>);
		return content2;
	}
}

export default App;
