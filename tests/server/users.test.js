const request = require('supertest')
    , {expect} = require('chai')
    , db = require('APP/db')
    , app = require('APP/app/server/start')


console.log('db is:', db.User)
/* global describe it before afterEach */

describe('/api/users', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('GET /:id', () =>
    describe('when not logged in', () =>
      it('fails with a 401 (Unauthorized)', () =>
        request(app)
          .get(`/api/users/1`)
          .expect(401)
      )))

  describe('POST', () =>
    describe('when not logged in', () => {
      it('creates a user', () =>
        request(app)
          .post('/api/users')
          .send({
            userName: 'Beth',
            email: 'beth@secrets.org',
            password: '12345'
          })
          .expect(201))

      it('redirects to the user it just made', () =>
        request(app)
          .post('/api/users')
          .send({
            userName: 'Eve',
            email: 'eve@interloper.com',
            password: '23456',
          })
          .redirects(1)
          .then(res => expect(res.body).to.contain({
            email: 'eve@interloper.com'
          })))

      it('does not fail with absence of username', () =>
        request(app)
          .post('/api/users')
          .send({
            email: 'beth@secrets.org',
            password: '12345'
          })
          .expect(201))

      it('fails when email is not correctly formatted', () =>
        request(app)
          .post('/api/users')
          .send({
            userName: 'Beth',
            email: 'bethsecrets',
            password: '12345'
          })
          .expect(500))

      it('fails when email is empty', () =>
        request(app)
          .post('/api/users')
          .send({
            userName: 'Beth',
            email: '',
            password: '12345'
          })
          .expect(500))
    }))
})
