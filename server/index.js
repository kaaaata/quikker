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

// TESTING ROUTES
app.get('/add/:user/:quantity', (req, res, next) => { // the only synchronous route
  // add :quantity passengers/drivers to the available_passengers queue
  const t0 = new Date().getTime()
  const output = dbHelpers.addUsers(req.params.user, req.params.quantity);
  res.status(200).json({
    message: `Successful GET -> /add/${req.params.user}/${req.params.quantity}`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.get('/matchtrips/:quantity', async(req, res, next) => {
  // match :quantity
  const t0 = new Date().getTime()
  const output = await dbHelpers.matchtrips(req.params.quantity);
  res.status(200).json({
    message: `Successful GET -> /matchtrips/${req.params.quantity}`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
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
app.get('/wipe', async(req, res, next) => {
  // wipe all data structures
  const t0 = new Date().getTime()
  const output = await dbHelpers.wipe();
  res.status(200).json({
    message: `Successful GET -> /wipe`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
    output: output
  });
});
app.get('/simulate', async(req, res, next) => {
  // real scenario: all 3 below functions happening at the same time.
  // 1. passengers constantly getting added
  // 2. drivers constantly getting added
  // 3. matching is performed repeatedly in the background
  const t0 = new Date().getTime();
  try {
    const passengerAddRepeat = 5;
    const driverAddRepeat = 5;
    const matchRepeat = 30;
    for (let i = 0; i < passengerAddRepeat; i++) {
      await dbHelpers.addUsers('passengers', 20000);
    }
    for (let i = 0; i < driverAddRepeat; i++) {
      await dbHelpers.addUsers('drivers', 20000);
    }
    for (let i = 0; i < matchRepeat; i++) {
      await dbHelpers.matchtrips(5000);
    }
    res.status(200).json({
      message: `Successful GET -> /simulate`,
      time: `${(new Date().getTime() - t0) / 1000}s`,
      output: null
    });
  } catch (e) {
    next(e);
  }
});
app.get('/million', async(req, res, next) => {
  // add one million trips to trips database
  const t0 = new Date().getTime()
  for (let i = 0; i < 200; i++) {
    await dbHelpers.addTenMillionTrips(i);
  }
  res.status(200).json({
    message: `Successful GET -> /million`,
    time: `${(new Date().getTime() - t0) / 1000}s`,
  });
});