const knex = require('./db');

const getFromOuterRim = async() => {
  console.log('doing getFromOuterRim');
  return (await knex.select().from('outer_rim')).length;
};


const postToOuterRim = async(rows = 1) => {
  console.log('doing postToOuterRim. rows: ', rows);
  const iterations = Math.ceil(rows / 30000);
  let done = 0;
  for (let i = 0; i < iterations; i++) {
    const rowsToPost = (rows - done >= 30000) ? 30000 : (rows - done);
    const result = await postToOuterRimHelper(rowsToPost, done, rows);
    done += rowsToPost;
    if (i === iterations - 1) return result;
  }
};
const postToOuterRimHelper = async(rows, done, total) => {
  // 30000 appears to be the upper limit to how many POST knex-psql can make in one insert call. 
  console.log(`inserting ${rows} rows after row ${done} / ${total}`);
  const inserts = Array(rows).fill({ text: 'cat was here', someNumber: 714 });
  return await knex.insert(inserts).into('outer_rim');
};


const deleteAllOuterRim = async() => {
  return await knex('outer_rim').del();
};


module.exports = {
  getFromOuterRim,
  postToOuterRim,
  deleteAllOuterRim,
};
