const knex = require('./db');
const faker = require('faker');

const get = async(table, query) => {
  console.log(`table ${table}: getting ${query}`);
  if (query === 'length') return (await knex.select().from(table)).length;
  if (query === 'all') return await knex.select().from(table);
  if (query === 'one') return await knex.select().from(table).limit(1);
};
const post = async(table, arrayOfJSON) => {
  // 15000 appears to be the upper limit to how many POST knex-psql can make in once insert call IN THIS SPECIFIC CASE. 
  // using smaller number now for testing
  const limit = 10000;
  if (!arrayOfJSON) arrayOfJSON = generateFakeData(table, limit); // no arrayOfJSON = generate fake data
  if (arrayOfJSON.length > limit) {
    console.log(`Error! arrayOfJSON.length must be <= ${limit}.`);
    return;
  }
  console.log(`table ${table}: posting ${arrayOfJSON.length} items`);
  return await knex.insert(arrayOfJSON).into(table);
};
const delete_ = async(table) => {
  console.log(`table ${table}: deleting all data`);
  if (table !== 'all') return await knex(table).delete();
  await knex('available_passengers').delete();
  await knex('available_drivers').delete();
  return await knex('trips').delete();
};
const match = async() => {
  // match available users with available drivers, take them off those tables, and add to trips table
  // to start off, this will only match with exact coordinates match
  const limit = 5000; // for testing, using smaller number
  const trips = [];
  // 1. select <limit> passengers who have been waiting longest time
  let available_passengers = await knex.select().from('available_passengers').limit(limit);
  // 2. for each available passenger, query drivers, matching user to driver in default FIFO order (queue)
  for (let i = 0; i < available_passengers.length; i++) {
    const driver = await knex.select().where('coordinates', available_passengers[i].coordinates).from('available_drivers').limit(1);
    if (!driver.length) continue; // sometimes no driver found. that's ok now, but later, may need to find closest driver
    trips.push({
      passenger: available_passengers[i].uid,
      passenger_name: available_passengers[i].name,
      passenger_origin_coordinates: available_passengers[i].coordinates,
      driver: driver[0].uid,
      driver_name: driver[0].name,
      driver_origin_coordinates: driver[0].coordinates,
      price: ~~(Math.random() * 90),
      status: 'matched',
      destination: available_passengers[i].destination,
    });
    await knex('available_drivers').where('uid', driver[0].uid).delete(); // remove driver so he don't get matched again
  }
  // 3. bulk insert entire array into trips
  console.log(`table trips: posting ${trips.length} items`);
  await knex('available_passengers').whereIn('uid', trips.map(trip => trip.passenger)).delete(); // remove all matched passengers
  return await knex.insert(trips).into('trips'); // bulk insert trips
}

const generateFakeData = (table, rows) => {
  let fakeData = Array(rows);
  if (table === 'available_passengers') {
    for (let i = 0; i < rows; i++) {      
      fakeData[i] = {
        age: ~~(Math.random() * 90),
        name: faker.name.findName(),
        coordinates: '' + ~~(Math.random() * 10) + ~~(Math.random() * 10),
        destination: faker.address.city(),
      }
    }
  } else if (table === 'available_drivers') {
    for (let i = 0; i < rows; i++) {      
      fakeData[i] = {
        age: ~~(Math.random() * 90),
        name: faker.name.findName(),
        car: faker.commerce.productName(),
        coordinates: '' + ~~(Math.random() * 10) + ~~(Math.random() * 10),
      }
    }
  }
  return fakeData;
};


module.exports = {
  get,
  post,
  delete_,
  match,
};
