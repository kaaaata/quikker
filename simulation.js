const axios = require('axios');
const faker = require('faker');

let trips = [];
let uid = 0; // ghetto way to auto-increment UID for passengers and drivers

const generateFakeData = (user, quantity = 1) => {
  const ret = [];
  for (let i = 0; i < quantity; i++) {
    if (user === 'passengers') {
      ret.push({
        uid: uid++,
        age: ~~(Math.random() * 80),
        name: faker.name.findName(),
        x: ~~(Math.random() * 1000),
        y: ~~(Math.random() * 1000),
        destination_x: ~~(Math.random() * 1000),
        destination_y: ~~(Math.random() * 1000),
      });
    } else if (user === 'drivers') {
      ret.push({
        uid: uid++,
        age: ~~(Math.random() * 80),
        name: faker.name.findName(),
        x: ~~(Math.random() * 1000),
        y: ~~(Math.random() * 1000),
        car: faker.commerce.productName(),
      });
    }
  }
  return ret;
};

const simulate = async() => {
  for (let i = 0; i < 40; i++) {
    await axios.post('http://localhost:9200/add/passengers', generateFakeData('passengers', 500));
  }
  for (let i = 0; i < 20; i++) {
    await axios.post('http://localhost:9200/add/drivers', generateFakeData('drivers', 500));
  }
  for (let i = 0; i < 1; i++) { // 5000 apiece
    trips = trips.concat((await axios.get('http://localhost:9200/matchtrips')).data.output);
  }
  for (let i = 0; i < 1; i++) {
    console.log('first trip: ', JSON.stringify(trips[0]));
    const tripsToUpdate = trips.slice(0, 1000).map(trip => {
      return { trip_uid: `${trip.passenger_uid}-${trip.driver_uid}`, status: 'completed' };
    });
    await axios.post('http://localhost:9200/updatetrips', tripsToUpdate);
  }
  console.log(`This simulation got ${trips.length} / ${1*5000} matches from ${40*500} passengers and ${20*500} drivers.`);
};

simulate();
