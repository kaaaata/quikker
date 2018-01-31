const express = require('express');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => { 
  console.log(`server see ${req.method} to ${req.path} with body ${JSON.stringify(req.body)}`);
  next();
});
app.listen(process.env.PORT || 9200);

app.get('/get/:table/:query', async(req, res, next) => {
  // query 'length': get the length of the table
  // query 'all': get all the data in the table
  const t0 = new Date().getTime()
  try {
    const awaiting = await dbHelpers.get(req.params.table, req.params.query);
    res.status(200).json({
      message: `Successful GET -> /get/${req.params.table}/${req.params.query}`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: awaiting
    });
  } catch (e) {
    next(e);
  }
});
app.get('/post/:table', async(req, res, next) => {
  const t0 = new Date().getTime()
  try {
    const awaiting = await dbHelpers.post(req.params.table);
    res.status(200).json({
      message: `Successful POST -> /post/${req.params.table}`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: awaiting
    });
  } catch (e) {
    next(e);
  }
});
app.get('/delete/:table', async(req, res, next) => {
  const t0 = new Date().getTime();
  try {
    const awaiting = await dbHelpers.delete_(req.params.table);
    res.status(200).json({
      message: `Successful DELETE -> /delete/${req.params.table}`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: awaiting
    });
  } catch (e) {
    next(e);
  }
});
app.post('/post/onemillion/:table', async(req, res, next) => {
  const t0 = new Date().getTime();
  try {
    for (let i = 0; i < 668; i++) {
      await dbHelpers.post(req.params.table);
      console.log(`In progress (${(i + 1) * 15000} / 10000000) POST -> /post/onemillion/${req.params.table}`);
      if (i === 667) res.status(201).json({
        message: `Successful POST -> /post/onemillion/${req.params.table}`,
        time: `${(new Date().getTime() - t0) / 1000}s`,
        output: awaiting
      });
    }
  } catch (e) {
    next(e);
  }
});
app.get('/match', async(req, res, next) => {
  const t0 = new Date().getTime();
  try {
    const awaiting = await dbHelpers.match();
    res.status(200).json({
      message: `Successful POST -> /match`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: awaiting
    });
  } catch (e) {
    next(e);
  }
});
app.get('/simulate', async(req, res, next) => {
  // real scenario: all 3 below functions happening at the same time.
  // passengers constantly getting added
  // drivers constantly getting added
  // every few seconds, matching is performed
  const t0 = new Date().getTime();
  try {
    const passengerAddRepeat = 3;
    const driverAddRepeat = 3;
    const matchRepeat = 5;
    for (let i = 0; i < passengerAddRepeat; i++) {
      dbHelpers.post('available_passengers');
    }
    for (let i = 0; i < driverAddRepeat; i++) {
      dbHelpers.post('available_drivers');
    }
    for (let i = 0; i < matchRepeat; i++) {
      await dbHelpers.match();
    }
    res.status(200).json({
      message: `Successful get -> /simulate`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: null
    });
  } catch (e) {
    next(e);
  }
});
