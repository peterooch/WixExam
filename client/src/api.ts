import axios from 'axios';
import {APIRootPath, CountSuffix} from '@fed-exam/config';
import {AppState} from './App';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type TicketCount = {
    count: number
}

export type ApiClient = {
    getTicketCount: () => Promise<TicketCount>;
    getTickets: (state: AppState) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTicketCount: () => {
            return axios.get(APIRootPath + CountSuffix).then((res) => res.data);
        },
        /* Make to accept AppState to avoid too much changes in call sites */
        getTickets: (state: AppState) => {
            return axios.get(`${APIRootPath}/?sortBy=${state.sort}&ascending=${state.ascending}&page=${state.currentPage}`)
                    .then((res) => res.data);
        }
    }
}
