import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import {TicketContent} from './TicketContent';

import 'bootstrap/dist/css/bootstrap.min.css';

export type AppState = {
	tickets?: Ticket[],
	ticketCount: number,
	search: string,
	sort: string,
	ascending: boolean
}

const api = createApiClient();

const sortTypes = ['date', 'title', 'email'] as const;

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		ticketCount: 0,
		search: '',
		sort: 'none',
		ascending: true
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			ticketCount:  (await api.getTicketCount()).count,
			tickets: await api.getTickets()
		});
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<button className="btn btn-info btn-sm" onClick={(_) => this.onEdit(ticket.id)}>Rename</button>
				<TicketContent children={ticket.content}/>
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
				<span className="label">{label}</span> 
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

	changeSort = async (type: string) => {
		let buttons = document.querySelectorAll('.sortbtn');
		
		for (let i = 0; i < buttons.length; i++) {
			let button = buttons.item(i);
			
			if (button.id === ('sort' + type)) {
				button.classList.add('btn-dark');
				button.classList.remove('btn-light');
			}
			else {
				button.classList.add('btn-light');
				button.classList.remove('btn-dark');
			}
		}

		if (type === this.state.sort)
			this.setState({ascending: !this.state.ascending})
		else
			this.setState({sort: type, ascending: false});
		
		this.setState({tickets: await api.getTickets(type, this.state.ascending)})
	}
	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{sortTypes.map((type) => <button className='sortbtn btn btn-light btn-sm' id={'sort' + type} onClick={(_) => this.changeSort(type)}>
										Sort by {type}
									 </button>)}
			{tickets ? <div className='results'>Showing {tickets.length} results out of {this.state.ticketCount} total tickets.</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;
