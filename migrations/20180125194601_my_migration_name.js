exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('trips', (trip) => {
    trip.increments('uid').notNullable().primary();
    trip.string('trip_uid').notNullable(); // 'passenger_uid' + '-' + 'driver_uid'
    trip.integer('passenger_uid').notNullable();
    trip.string('passenger_name').notNullable();
    trip.integer('passenger_origin_x').notNullable();
    trip.integer('passenger_origin_y').notNullable();
    trip.integer('driver_uid').notNullable();
    trip.string('driver_name').notNullable();
    trip.integer('driver_origin_x').notNullable();
    trip.integer('driver_origin_y').notNullable();
    trip.integer('price').notNullable();
    trip.string('status').notNullable();
    trip.integer('destination_x').notNullable();
    trip.integer('destination_y').notNullable();
  }),
  knex.schema.createTableIfNotExists('historical_trips', (trip) => {
    trip.increments('uid').notNullable().primary();
    trip.string('trip_uid').notNullable(); // 'passenger_uid' + '-' + 'driver_uid'
    trip.integer('passenger_uid').notNullable();
    trip.string('passenger_name').notNullable();
    trip.integer('passenger_origin_x').notNullable();
    trip.integer('passenger_origin_y').notNullable();
    trip.integer('driver_uid').notNullable();
    trip.string('driver_name').notNullable();
    trip.integer('driver_origin_x').notNullable();
    trip.integer('driver_origin_y').notNullable();
    trip.integer('price').notNullable();
    trip.string('status').notNullable();
    trip.integer('destination_x').notNullable();
    trip.integer('destination_y').notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTableIfExists('trips'),
  knex.schema.dropTableIfExists('historical_trips'),
]);
