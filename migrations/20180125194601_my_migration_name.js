exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('outer_rim', (shit) => {
    shit.increments('uid').notNullable().primary();
    shit.integer('someNumber');
    shit.string('text').notNullable();
  }),
  knex.schema.createTableIfNotExists('available_passengers', (passenger) => {
    passenger.increments('uid').notNullable().primary();
    passenger.integer('age').notNullable();;
    passenger.string('name').notNullable();
    passenger.string('coordinates').notNullable();
    passenger.string('destination').notNullable();
  }),
  knex.schema.createTableIfNotExists('available_drivers', (driver) => {
    driver.increments('uid').notNullable().primary();
    driver.integer('age').notNullable();;
    driver.string('name').notNullable();;
    driver.string('car').notNullable();
    driver.string('coordinates').notNullable();
  }),
  knex.schema.createTableIfNotExists('trips', (trip) => {
    trip.increments('uid').notNullable().primary();
    trip.integer('passenger').notNullable();
    trip.string('passenger_name').notNullable();
    trip.string('passenger_origin_coordinates').notNullable();
    trip.integer('driver').notNullable();
    trip.string('driver_name').notNullable();
    trip.string('driver_origin_coordinates').notNullable();
    trip.integer('price').notNullable();
    trip.string('status').notNullable();
    trip.string('destination').notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  // knex.schema.table('outer rim', (shit) => {
  //   shit.dropForeign('user_id');
  // }),
  knex.schema.dropTableIfExists('outer_rim'),
]);

