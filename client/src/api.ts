import axios from 'axios';
import {APIRootPath, UpdateSuffix} from '@fed-exam/config';
import {AppState, sortTypes} from './App';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type QueryResult = {
    tickets: Ticket[],
    count: number
}

export type ApiClient = {
    getTickets: (state: AppState) => Promise<QueryResult>;
    updateTicket: (ticket: Ticket) => Promise<void>;
}

export const createApiClient = (): ApiClient => {
    return {
        /* Make to accept AppState to avoid too much changes in call sites */
        getTickets: (state: AppState) => {
            let queries: string[] = [];

            if (sortTypes.includes(state.sort)) {
                queries.push(`sortBy=${state.sort}`);
                queries.push(`ascending=${state.ascending}`)
            }
            if (state.search !== '')
                queries.push(`search=${state.search}`);
            
            queries.push(`page=${state.currentPage}`);
            queries.push(`pageSize=${state.ticketsPerPage}`);

            return axios.get(`${APIRootPath}/?${queries.join('&')}`).then((res) => res.data);
        },
        updateTicket: (ticket: Ticket) => {
            return axios.post(APIRootPath + UpdateSuffix, ticket);
        }
    }
}
