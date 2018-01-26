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

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome to the outer rim', });
});

// GET QUERY (currently only works for length)
// query length: see how many rows there are
// query row: see the data at a chosen row
app.get('/rim/get/:query', async(req, res, next) => {
  try {
    const awaiting = await dbHelpers.getFromOuterRim();
    res.status(200).json({ message: 'Successful GET -> /rim/get', length: awaiting });
  } catch (e) {
    next(e);
  }
});

// POST X ROWS
app.post('/rim/post/:rows', async(req, res, next) => {
  try {
    const awaiting = await dbHelpers.postToOuterRim(~~req.params.rows);
    res.status(201).json({ message: 'Successful POST -> /rim/get', awaiting: awaiting });
  } catch (e) {
    next(e);
  }
});

// DELETE ALL ROWS
app.get('/rim/delete', async(req, res, next) => {
  try {
    const awaiting = await dbHelpers.deleteAllOuterRim();
    res.status(200).json({ message: 'Success GET -> /rim/delete', length: awaiting });
  } catch (e) {
    next(e);
  }
});