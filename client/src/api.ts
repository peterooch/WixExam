import axios from 'axios';
import {APIRootPath, CountSuffix} from '@fed-exam/config';

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
    getTickets: (sortType?: string, ascending?: boolean) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTicketCount: () => {
            return axios.get(APIRootPath + CountSuffix).then((res) => res.data);
        },
        getTickets: (sortType?: string, ascending?: boolean) =>
        {
            return axios.get(`${APIRootPath}/?sortBy=${sortType}&ascending=${ascending}`)
                    .then((res) => res.data);
        }
    }
}
