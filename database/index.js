const knex = require('./db');
const faker = require('faker');
const _ = require('lodash');
const dataStructures = require('./dataStructures');


let uid = 0; // ghetto way to auto-increment UID for passengers and drivers
let available_passengers = new dataStructures.Queue();
let available_drivers = Array(1000).fill(Array(1000).fill(null));

// TESTING FUNCTIONS
const addUser = (user, data) => {
  // add passengers/drivers to available_passengers/available_drivers
  if (user === 'passengers') {
    for (let i = 0; i < data.length; i++) {
      available_passengers.enqueue(data[i]);
    }
  } else if (user === 'drivers') {
    for (let i = 0; i < data.length; i++) {
      if (!available_drivers[data[i].y][data[i].x]) {
        available_drivers[data[i].y][data[i].x] = new dataStructures.Queue();
      } else {
        available_drivers[data[i].y][data[i].x].enqueue(data[i]);
      }
    } 
  }
  return `Just added ${data.length} available ${user}.`;
};
const updateTrips = async(trips) => {
  // update status of many trips 'picking-up', 'in-progress', 'completed', 'cancelled'
  // input is like [ { uid: <integer>, status: <string> }, ... ];
  console.log(`Trying to update ${trips.length} trips, first one: ${JSON.stringify(trips[0])}`);
  for (let i = 0; i < trips.length; i++) {
    await knex('trips').where('trip_uid', trips[i].trip_uid).update({ status: trips[i].status });
  }
  const tripsCompletedOrCancelled = await knex.select().from('trips').whereIn('status', ['completed', 'cancelled']);
  await knex('trips').whereIn('status', ['completed', 'cancelled']).delete();
  await knex('historical_trips').insert(tripsCompletedOrCancelled);
};
const matchTrips = async() => {
  // create 5000 matches to trips database
  const trips = [];
  for (let i = 0; i < 5000; i++) {
    // no available passengers? end immediately
    if (!available_passengers.size()) return;

    // declare to-be-passenger, to-be-driver
    const passenger = available_passengers.first();
    let driver = null;

    // driver found in exact coordinates? match first one
    if (available_drivers[passenger.y][passenger.x] && available_drivers[passenger.y][passenger.x].size()) {
      driver = available_drivers[passenger.y][passenger.x].dequeue();
    } else {
    // no drivers found in exact coordinates? go to next nearest driver. (basic functionality, not optimized)
      let radius = 1;
      let expansion = ['init'];
      while (expansion.length) {
        expansion = [];
        
        for (j = passenger.x - radius; j <= passenger.x + radius; j++) {
          expansion.push({ y: passenger.y - radius, x: j });
          expansion.push({ y: passenger.y + radius, x: j });
        }
        for (j = passenger.y - radius; j <= passenger.y + radius; j++) {
          expansion.push({ y: j, x: passenger.x - radius });
          expansion.push({ y: j, x: passenger.x + radius });
        }
        console.log(expansion);
        expansion = _.uniq(expansion.map(item => JSON.stringify(item))).map(item => JSON.parse(item));
        console.log('expansion filtered', expansion);
        for (let j = 0; j < expansion.length; j++) { // expansion[i] like { y: <number>, x: <number> }
          if (available_drivers[expansion[j].y][expansion[j].x] && available_drivers[expansion[j].y][expansion[j].x].size()) {
            console.log('external match found at radius ', radius);
            driver = available_drivers[expansion[j].y][expansion[j].x].dequeue();
            j = expansion.length; // break j
            expansion = []; // break while
          }
        }
        radius++; // no match found? expand search radius
      }
    }
    if (driver) {
      available_passengers.dequeue();
      trips.push({
        trip_uid: `${passenger.uid}-${driver.uid}`,
        passenger_uid: passenger.uid,
        passenger_name: passenger.name,
        passenger_origin_x: passenger.x,
        passenger_origin_y: passenger.y,
        driver_uid: driver.uid,
        driver_name: driver.name,
        driver_origin_x: driver.x,
        driver_origin_y: driver.y,
        price: ~~(Math.random() * 50),
        status: 'picking-up', // 'picking-up', 'in-progress', 'completed', 'cancelled'
        destination_x: passenger.destination_x,
        destination_y: passenger.destination_y,
      });
    }
  }
  await knex.insert(trips).into('trips');
  return trips;
};
const see = async(query) => {
  // see the current state of the data structures
  let ret = [null, null, null, null];
  if (query === 'length') {
    ret[0] = available_passengers.size();
    ret[1] = 'chuck norris';
    ret[2] = await knex('trips').count('uid');
    ret[3] = await knex('historical_trips').count('uid');
  } else if (query === 'one') {
    ret[0] = available_passengers.first() || 'nothing here';
    ret[1] = available_drivers[0].slice(0, 5);
    ret[2] = await knex.select().from('trips').limit(1) || 'nothing here';
    ret[3] = await knex.select().from('historical_trips').limit(1) || 'nothing here';
  }
  return { 'available_passengers': ret[0], 'available_drivers': ret[1], 'trips': ret[2], 'historical_trips': ret[3] };
}
const wipeQueues = () => {
  // reset all non-persistent data structures
  available_passengers = new dataStructures.Queue();
  available_drivers = Array(1000).fill(Array(1000).fill(null));
};
const addOneMillionTrips = async(iteration) => {
  for (let i = 0; i < 200; i++) {
    await addFiveThousandTrips();
    console.log(`Added ${iteration * 1000000 + (i + 1) * 5000} / 10000000 trips`);
  }
};
const addFiveThousandTrips = async() => {
  const trips = [];
  for (let i = 0; i < 5000; i++) {
    trips.push({
      trip_uid: uid++,
      passenger_uid: uid++,
      passenger_name: faker.name.findName(),
      passenger_origin_x: ~~(Math.random() * 1000),
      passenger_origin_y: ~~(Math.random() * 1000),
      driver_uid: uid++,
      driver_name: faker.name.findName(),
      driver_origin_x: ~~(Math.random() * 1000),
      driver_origin_y: ~~(Math.random() * 1000),
      price: ~~(Math.random() * 50),
      status: 'picking-up', // available, picking-up, in-transit 
      destination_x: ~~(Math.random() * 1000),
      destination_y: ~~(Math.random() * 1000),
    });
  }
  await knex.insert(trips).into('historical_trips');
};


module.exports = {
  addUser,
  updateTrips,
  matchTrips,
  see,
  wipeQueues,
  addOneMillionTrips,
};
