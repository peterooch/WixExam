import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTickets: () => Promise<Ticket[]>;
    getSortedTickets: (sortType: string, ascending: boolean) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        },
        getSortedTickets: (sortType: string, ascending: boolean) =>
        {
            return axios.get(`${APIRootPath}/?sortBy=${sortType}&ascending=${ascending}`)
                    .then((res) => res.data);
        }
    }
}
