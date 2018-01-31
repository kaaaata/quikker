exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('trips', (trip) => {
    trip.increments('uid').notNullable().primary();
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
  // knex.schema.table('outer rim', (shit) => {
  //   shit.dropForeign('user_id');
  // }),
  knex.schema.dropTableIfExists('trips'),
]);

