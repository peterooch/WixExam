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

app.get(APIPath, (req, res) => {

    // @ts-ignore
    const page: number = req.query.page || 1;

    const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const sortType: string = req.query.sortBy as string;

    if (sortType === "")
        res.send(paginatedData); /* No sort required so send the data as is */

    const ascending: string = req.query.ascending as string;
    let sortedTickets: Ticket[];
    let reverse = (ascending === 'false');

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
            /* No sort required so send the data as is */
            res.send(paginatedData);
            return;
    }

    res.send(sortedTickets);
});

app.get(APIPath + CountSuffix, (req, res) => {
    res.send({ count: tempData?.length ?? 0 });
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

/**
 * email regex : (email:\w+@\w+\.\w+)
 * before/after : (after:\d{1,2}\/\d{1,2}\/\d{4})
 */