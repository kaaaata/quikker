exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('outer rim', (shit) => {
    shit.increments('uid').notNullable().primary();
    shit.integer('someNumber');
    shit.string('text').notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  // knex.schema.table('outer rim', (shit) => {
  //   shit.dropForeign('user_id');
  // }),
  knex.schema.dropTableIfExists('outer rim'),
]);

