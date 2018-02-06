const express = require('express');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(process.env.PORT || 9200);

// PRODUCTION ROUTES
app.post('/add/:user', (req, res, next) => {
  // add :drivers/:passengers
  // req.body is an array of objects representing passenger data
  const t0 = new Date().getTime();
  const output = dbHelpers.addUser(req.params.user, req.body);
  res.status(201).json({
    message: `Successful POST -> /add/${req.params.user}`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.post('/updatetrips', (req, res, next) => {
  // update status of many trips 'picking-up', 'in-progress', 'completed', 'cancelled'
  // req.body is like [ { uid: <integer>, status: <string> }, ... ];
  const t0 = new Date().getTime();
  const output = dbHelpers.updateTrips(req.body);
  res.status(201).json({
    message: 'Successful POST -> /updatetrips',
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.get('/matchtrips', async(req, res, next) => {
  // match trips 5000
  const t0 = new Date().getTime()
  const output = await dbHelpers.matchTrips();
  res.status(200).json({
    message: `Successful GET -> /matchtrips`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});

// DEVELOPMENT ROUTES
app.get('/see/:query', async(req, res, next) => {
  // view the data structures :query = 'all', 'one', 'length'
  const t0 = new Date().getTime()
  const output = await dbHelpers.see(req.params.query);
  res.status(200).json({
    message: `Successful GET -> /see/${req.params.query}}`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.get('/wipequeues', async(req, res, next) => {
  // reset available_drivers and available_passengers
  const t0 = new Date().getTime()
  const output = await dbHelpers.wipeQueues();
  res.status(200).json({
    message: 'Successful GET -> /wipequeues',
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.get('/million', async(req, res, next) => {
  // add one million trips to trips database
  const t0 = new Date().getTime()
  for (let i = 0; i < 10; i++) {
    await dbHelpers.addOneMillionTrips(i);
  }
  res.status(200).json({
    message: `Successful GET -> /million`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
  });
});
