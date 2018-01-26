const express = require('express');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`${req.path}, ${req.method}, ${req.status}, ${JSON.stringify(req.body)}`);
  next();
});

app.listen(process.env.PORT || 9200);

app.get('/', (req, res) => {
  console.log('-> GET/');
  res.status(200).json({ message: 'welcome to the outer rim', });
});
app.get('/rim', async(req, res, next) => {
  console.log('-> GET/rim');
  try {
    const awaiting = await dbHelpers.helloWorld();
    res.status(200).json({ message: 'Successful GET/rim' });
  } catch (e) {
    next(e);
  }
});

app.post('/rim/post', async(req, res, next) => {
  console.log('-> POST/rim');
  try {
    const awaiting = await dbHelpers.helloWorld();
    res.status(201).json({ message: 'Successful POST/rim' });
  } catch (e) {
    next(e);
  }
});
