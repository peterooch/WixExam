import express from 'express';
import { Data } from './dataapi';
import { serverAPIPort, APIPath, PAGE_SIZE, UpdateSuffix } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

/* Regular expressions for the advanced search options */
const emailRE  = /email:([A-Za-z0-9\+\._]+@[\w+\.]+\w+)/;
const beforeRE = /before:(\d{1,2}\/\d{1,2}\/\d{4})/;
const afterRE  = /after:(\d{1,2}\/\d{1,2}\/\d{4})/;

/* Switch string from DD/MM/YYYY to MM/DD/YYYY */
const fixDate = (date: string): string => {
    const parts = date.split("/");
    return `${parts[1]}/${parts[0]}/${parts[2]}`;
}

app.get(APIPath, (req, res) => {
    
    /* Process GET parameters */
    // @ts-ignore
    const page: number = req.query.page || 1;
    const sortType: string = req.query.sortBy as string;
    const reverse: boolean = req.query.ascending === 'false';
    const search: string = req.query.search as string;
    
    let pageSize: number = Number(req.query.pageSize);
    
    if (pageSize === NaN || pageSize < 1)
        pageSize = PAGE_SIZE;

    let tickets = Data.getTickets();

    /* Assuming only 0 to 1 occurences of each filter expression */
    if (search) {
        /* look for possible matches */
        const emailMatch  = search.match(emailRE)?.[1];
        const beforeMatch = search.match(beforeRE)?.[1];
        const afterMatch  = search.match(afterRE)?.[1];
        
        /* Remove the patterns from query if they might exist */
        const cleaned = search.replace(emailRE, "")
                              .replace(beforeRE, "")
                              .replace(afterRE, "")
                              .trim();
        
        if (emailMatch) {
            tickets = tickets.filter(t => t.userEmail === emailMatch);
        }

        if (beforeMatch || afterMatch) {
            if (beforeMatch && afterMatch) {
                const before = new Date(fixDate(beforeMatch)).getTime();
                const after  = new Date(fixDate(afterMatch)).getTime();
                tickets = tickets.filter(t => t.creationTime > after && t.creationTime < before);
            }
            else if (afterMatch) {
                const after = new Date(fixDate(afterMatch)).getTime();
                tickets = tickets.filter(t => t.creationTime > after);
            }
            else if (beforeMatch) {
                const before = new Date(fixDate(beforeMatch)).getTime();
                tickets = tickets.filter(t => t.creationTime < before);
            }
        }

        tickets = tickets
            .filter(t => (t.title.toLowerCase() + t.content.toLowerCase()).includes(cleaned.toLowerCase()));
    }

    /* apply sort if there is a valid value */
    switch (sortType) {
        case 'date':
            if (!reverse)
                tickets = tickets.sort((x, y) => x.creationTime - y.creationTime);
            else
                tickets = tickets.sort((y, x) => x.creationTime - y.creationTime);
            break;
        case 'title':
            if (!reverse)
                tickets = tickets.sort((x, y) => x.title.localeCompare(y.title));
            else
                tickets = tickets.sort((y, x) => x.title.localeCompare(y.title));
            break;
        case 'email':
            if (!reverse)
                tickets = tickets.sort((x, y) => x.userEmail.localeCompare(y.userEmail));
            else
                tickets = tickets.sort((y, x) => x.userEmail.localeCompare(y.userEmail));
            break;
    }
    const pageTickets = tickets.slice((page - 1) * pageSize, page * pageSize);
    res.send({tickets: pageTickets, count: tickets.length});
});

app.post(APIPath + UpdateSuffix, (req, res) => {
    const ticket = req.body as Ticket;
    Data.saveTicket(ticket);
    res.send('OK');
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
