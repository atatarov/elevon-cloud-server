process.env.NODE_ENV = 'test';

const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

const userEmail = 'anothertestmail@gmail.com';
const userPassword = '1234567890';

describe('User', () => {
  before((done) => {
    User.deleteMany({}, (error) => done());
  });

  describe('POST /signup', () => {
    it('it should POST a user', (done) => {
      const user = {
        email: userEmail,
        password: userPassword,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('sign in', (done) => {
      const user = {
        email: userEmail,
        password: userPassword,
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.not.have.property('password');
          token = res.body.token;
          done();
        });
    });
  });
});
