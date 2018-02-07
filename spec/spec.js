const request = require('supertest');
const app = require('../server/index');

// TESTS FOR SERVER ONLY!!

// LINE REDUCER EZ TEST
const ez_test = (args) => {
  if (args.status === 200) {
    it(args.it, done => { request(app).get(args.route).expect(args.cb).expect(args.status, done) });
  } else if (args.status === 201) {
    it(args.it, done => { request(app).post(args.route).expect(args.cb).expect(args.status, done) }); 
  }
};

// PRODUCTION TESTS
describe('/add:user', () => {
  ez_test({ it: 'server :passengers res with 201 and body', route: '/add/passengers', status: 201, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: 'server :drivers res with 201 and body', route: '/add/drivers', status: 201, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: 'res :passengers body with output obj', route: '/add/passengers', status: 201, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
  ez_test({ it: 'res :drivers body with output obj', route: '/add/drivers', status: 201, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
});
describe('/updatetrips', () => {
  ez_test({ it: 'server res with 201 and body', route: '/updatetrips', status: 201, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: 'res body with output obj', route: '/updatetrips', status: 201, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
});
describe('/matchtrips', () => {
  ez_test({ it: 'server res with 200 and body', route: '/matchtrips', status: 200, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: 'res body with output obj', route: '/matchtrips', status: 200, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
});

// DEVELOPMENT TESTS
describe('/see:query', () => {
  ez_test({ it: 'server :length res with 200 and body', route: '/see/length', status: 200, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: ':length res body with output obj', route: '/see/length', status: 200, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
  ez_test({ it: 'server :one res with 200 and body', route: '/see/one', status: 200, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: ':one res body with output obj', route: '/see/one', status: 200, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body))) throw new Error('you suck!');}});
});
describe('/wipequeues', () => {
  ez_test({ it: 'server res with 200 and body', route: '/wipequeues', status: 200, cb: (res) => {
    if (!(res.body)) throw new Error('you suck!');}});
  ez_test({ it: 'res body with message:string, time:string', route: '/wipequeues', status: 200, cb: (res) => {
    if (!(typeof res.body === 'object' && !Array.isArray(res.body) &&
      typeof res.body.message === 'string' && typeof res.body.time === 'string')) throw new Error('you suck!');}});
});
