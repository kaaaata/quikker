const knex = require('./db');
const faker = require('faker');
const dataStructures = require('./dataStructures');

let uid = 0; // ghetto way to auto-increment UID for passengers and drivers
let available_passengers = new dataStructures.Queue();
//let available_drivers = Array(1000).fill(Array(1000).fill(new dataStructures.Queue()));
let available_drivers = Array(1000).fill(Array(1000).fill(null));

const addUsers = (user, quantity) => {
  // add <quantity> passengers/drivers to available_passengers/available_drivers
  if (user === 'passengers') {
    for (let i = 0; i < quantity; i++) {
      available_passengers.enqueue(generateFakeData(user));
    }
  } else if (user === 'drivers') {
    for (let i = 0; i < quantity; i++) {
      const driver = generateFakeData(user);
      if (!available_drivers[driver.y][driver.x]) {
        available_drivers[driver.y][driver.x] = new dataStructures.Queue();
      } else {
        available_drivers[driver.y][driver.x].enqueue(driver);
      }
    }
  }
  return `Just added ${quantity} ${user}. `;
};
const matchtrips = async(quantity) => {
  // create <quantity> matches to trips database
  const trips = [];
  for (let i = 0; i < quantity; i++) {
    if (!available_passengers.size()) return;
    const passenger = available_passengers.dequeue();
    if (!available_drivers[passenger.y][passenger.x] || !available_drivers[passenger.y][passenger.x].size()) { // refactor this later for more advanced matching
      console.log('no match found');
      continue;
    }
    const driver = available_drivers[passenger.y][passenger.x].dequeue();
    trips.push({
      passenger_uid: passenger.uid,
      passenger_name: passenger.name,
      passenger_origin_x: passenger.x,
      passenger_origin_y: passenger.y,
      driver_uid: driver.uid,
      driver_name: driver.name,
      driver_origin_x: driver.x,
      driver_origin_y: driver.y,
      price: ~~(Math.random() * 50),
      status: 'picking-up',
      destination_x: passenger.destination_x,
      destination_y: passenger.destination_y,
    });
  }
  return await knex.insert(trips).into('trips');
};
const see = async(query) => {
  // see the current state of the data structures
  let dataStructures = [
    available_passengers,
    available_drivers,
    await knex.select().from('trips'),
  ];
  let ret = [null, null, null];
  if (query === 'length') {
    ret[0] = dataStructures[0].size();
    ret[1] = 'chuck norris';
    ret[2] = dataStructures[2].length;
  } else if (query === 'one') {
    ret[0] = dataStructures[0].first() || 'nothing here';
    ret[1] = dataStructures[1][0].slice(0, 5);
    ret[2] = dataStructures[2][0] || 'nothing here';
  }
  return { 'available_passengers': ret[0], 'available_drivers': ret[1], 'trips': ret[2] };
}
const wipe = async() => {
  // wipe all data structures
  available_passengers = new dataStructures.Queue();
  available_drivers = Array(1000).fill(Array(1000).fill(null));
  await knex('trips').delete();
};
const generateFakeData = (user) => {
  return user === 'passengers' ?
    {
      uid: uid++,
      age: ~~(Math.random() * 80),
      name: faker.name.findName(),
      x: ~~(Math.random() * 1000),
      y: ~~(Math.random() * 1000),
      destination_x: ~~(Math.random() * 1000),
      destination_y: ~~(Math.random() * 1000),
    } :
    {
      uid: uid++,
      age: ~~(Math.random() * 80),
      name: faker.name.findName(),
      x: ~~(Math.random() * 1000),
      y: ~~(Math.random() * 1000),
      car: faker.commerce.productName(),
    };
};


module.exports = {
  addUsers,
  matchtrips,
  see,
  wipe,
};
