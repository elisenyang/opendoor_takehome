"use strict"

const chai = require('chai')
const expect = chai.expect

var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var app = require('../app')


//listing tests
describe('Listing Test', function(){
  it("GET /listings", function(done){
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done()
      })
  })
})




//descirbe creates a test suite
//can put suites within suites
// describe('Express tests', function() {
//
//   it("GET /listings", function(done) {
//     chai.request(app)
//       .get('/')
//       .end(function(err, res) {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body.success).to.equal(true);
//         //adding argument done ensures request finishes betfore running test
//         done();
//       })
//   })
//
//   it("POST /", function(done) {
//     chai.request(app)
//     .post('/')
//   })
// })



//.send(add body)
//.query(query parameters)
//.header('Authoriazation', '')
