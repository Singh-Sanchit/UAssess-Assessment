var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style
let chaiHttp = require('chai-http');
let server = require('../app');

chai.use(chaiHttp);
var questionId = "";

describe('POST api/create-question', function() {
  describe('', function() {
    it('Response should be Ok and should contains required params', (done)=>{
      var data = {
        "token":"1-2-3",
        "title":"123",
        "optionType":"text",
        "questionType":"multiple",
        "answerType":"single",
        "competencies": [],
        "subCompetencies": [],
        "options":[],
        "expiresAt":"2019-10-10",
        "weightage":0,
        "state":"approved",
        "createdBy":"userid1234",
        "ownerId":"userid1234"
      }
      chai.request(server)
          .post('/api/create-question')
          .send(data)
          .end((err, res) => {
            questionId = res.body._id;
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            done();
          })
    });
    it('without title should return response code 1 and messag', (done)=>{
      var data = {"token":"1-2-3"};
      chai.request(server)
          .post('/api/create-question')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    });
    it('Should not create question if title is same', (done)=>{
      var data = {
        "token":"1-2-3",
        "title":"123",
        "optionType":"text",
        "questionType":"multiple",
        "answerType":"single",
        "competencies": [],
        "subCompetencies": [],
        "options":[],
        "expiresAt":"2019-10-10",
        "weightage":0,
        "state":"approved",
        "createdBy":"userid1234",
        "ownerId":"userid1234"
      };
      chai.request(server)
          .post('/api/create-question')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    });
    it('Should return error response for empty request', (done)=>{
      chai.request(server)
          .post('/api/create-question')
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    })
  });
});

describe('POST api/update-question', function() {
  describe('', function() {
    it('Response should be Ok and should contains required params', (done)=>{
      var data = {
        "token":"1-2-3",
        "title":"123",
        "optionType":"text",
        "questionType":"multiple",
        "answerType":"single",
        "competencies": [],
        "subCompetencies": [],
        "options":[],
        "expiresAt":"2019-10-10",
        "weightage":0,
        "state":"approved",
        "updatedBy":"userid1234",
        "ownerId":"userid1234",
        "questionId":"123"
      }
      chai.request(server)
          .post('/api/update-question')
          .send(data)
          .end((err, res) => {
            questionId = res.body._id;
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            done();
          })
    });
    it('without title should return response code 1 and message', (done)=>{
      var data = {"token":"1-2-3"};
      chai.request(server)
          .post('/api/create-question')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    });
    it('Should not update question if title is same', (done)=>{
      var data = {
        "token":"1-2-3",
        "title":"123",
        "optionType":"text",
        "questionType":"multiple",
        "answerType":"single",
        "competencies": [],
        "subCompetencies": [],
        "options":[],
        "expiresAt":"2019-10-10",
        "weightage":0,
        "state":"approved",
        "createdBy":"userid1234",
        "ownerId":"userid1234"
      };
      chai.request(server)
          .post('/api/update-question')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    });
    it('Should return error response for empty request', (done)=>{
      chai.request(server)
          .post('/api/update-question')
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).should.be.a('object');
            expect(res.body).to.have.property('code').equal('1');
            expect(res.body).to.have.property('message');
            done();
          })
    })
  });
});