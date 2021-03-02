import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath, CountSuffix, PAGE_SIZE } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

app.use(bodyParser.json());

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

app.get(APIPath, (req, res) => {

    // @ts-ignore
    const page: number = req.query.page || 1;

    const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const sortType: string = req.query.sortBy as string;
    const reverse: boolean = req.query.ascending === 'false';
    let sortedTickets: Ticket[];

    switch (sortType) {
        case 'date':
            if (!reverse)
                sortedTickets = paginatedData.sort((x, y) => x.creationTime - y.creationTime);
            else
                sortedTickets = paginatedData.sort((y, x) => x.creationTime - y.creationTime);
            break;
        case 'title':
            if (!reverse)
                sortedTickets = paginatedData.sort((x, y) => x.title.localeCompare(y.title));
            else
                sortedTickets = paginatedData.sort((y, x) => x.title.localeCompare(y.title));
            break;
        case 'email':
            if (!reverse)
                sortedTickets = paginatedData.sort((x, y) => x.userEmail.localeCompare(y.userEmail));
            else
                sortedTickets = paginatedData.sort((y, x) => x.userEmail.localeCompare(y.userEmail));
            break;
        default:
            sortedTickets = paginatedData;
            break;
    }
    
    res.send(sortedTickets);
});

app.get(APIPath + CountSuffix, (_req, res) => {
    res.send({ count: tempData?.length ?? 0 });
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
