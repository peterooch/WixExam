import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket} from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

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
  const ascending: string = req.query.ascending as string;

  let sortedTickets: Ticket[];
  let sorted: boolean = true;

  switch (sortType) {
    case 'date':
      sortedTickets = paginatedData.sort((x, y) => x.creationTime - y.creationTime);
      break;
    case 'title':
      sortedTickets = paginatedData.sort((x, y) => x.title.localeCompare(y.title));
      break;
    case 'email':
      sortedTickets = paginatedData.sort((x, y) => x.userEmail.localeCompare(y.userEmail));
      break;
    default:
      sortedTickets = paginatedData;
      sorted = false;
      break;
  }

  if (sorted && ascending === 'false')
    sortedTickets = sortedTickets.reverse();

  res.send(sortedTickets);
});

app.get(`${APIPath}/Count`, (req, res) => {

});
app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

