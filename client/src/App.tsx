import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TicketContent } from './TicketContent';
import { PAGE_SIZE } from '@fed-exam/config';

import 'bootstrap/dist/css/bootstrap.min.css';

export type AppState = {
	tickets?: Ticket[],
	ticketCount: number,
	currentPage: number,
	search: string,
	sort: string,
	ascending: boolean
}

const api = createApiClient();

const sortTypes = ['date', 'title', 'email'] as const;

export class App extends React.Component<{}, AppState> {

	state: AppState = {
		ticketCount: 0,
		currentPage: 1,
		search: '',
		sort: 'none',
		ascending: true
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			ticketCount:  (await api.getTicketCount()).count,
			tickets: await api.getTickets(this.state)
		});
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<button className="btn btn-info btn-sm" onClick={(_) => this.onEdit(ticket.id)}>Rename</button>
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

	onEdit = async (ticketId: string) => {

		let ticket = this.state.tickets?.find(t => t.id === ticketId);
		let newtitle = prompt("Title rename", ticket?.title);

		if (ticket && newtitle) {
			ticket.title = newtitle;
			this.forceUpdate();
		}
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}
	
	updateTickets = async () => {
		this.setState({tickets: await api.getTickets(this.state)})
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
			{sortTypes.map((type) => <button key={type}
											 className={`sortbtn btn ${this.state.sort === type ? 'btn-dark' : 'btn-light'} btn-sm`}
											 onClick={(_) => this.changeSort(type)}>
										Sort by {type}
									 </button>)}
			{tickets ? <div className='results'>Showing {tickets.length} results out of {this.state.ticketCount} total tickets.</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<nav>
				<ul className='pagination justify-content-center'>
					{[...Array(this.state.ticketCount / PAGE_SIZE).keys()]
						.map((item) => (<li key={item + 1} className={`page-item ${(this.state.currentPage === item + 1) ? "active" : ""}`}>
							<button className="page-link"
								    onClick={() => this.changePage(item + 1)}>
							{item + 1}
							</button>
						</li>))}
				</ul>
			</nav>
		</main>)
	}
}

export default App;
