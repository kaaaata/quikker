const knex = require('./db');

const helloWorld = () => {
  console.log('Hello World!');
  knex.insert({
    text: 'Hello World!',
    someNumber: 714714714,
  }).into('outer rim')
    .then(() => {
      return 'LOLOLOL';
    });
};

module.exports = {
  helloWorld,
};
