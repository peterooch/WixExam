import {Ticket} from '../client/src/api';

import fs from 'fs';

/* Data management class */
export class Data {

    static dataFile = './data.json';
    static doUpdate = true;
    static tickets: Ticket[];

    public static getTickets(): Ticket[] {
        if (Data.doUpdate) {
            let buffer = fs.readFileSync(Data.dataFile);
            Data.tickets = JSON.parse(buffer.toString());
            Data.doUpdate = false;
        }
        return Data.tickets;
    }

    public static async saveTicket(ticket: Ticket) {
        let index = Data.tickets.findIndex(t => t.id === ticket.id);
        if (index === -1)
            return;
        Data.tickets[index] = ticket;
        fs.writeFileSync(Data.dataFile, JSON.stringify(ticket));
    }
}
