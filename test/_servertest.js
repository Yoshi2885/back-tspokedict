const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");

const server = setupServer();
describe("Pokedict APP", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });
  describe("GET /randomtest", () => {
    it("typeがobjectか？", (done) => {
      request.get("/randomtest").end((err, res) => {
        expect(typeof res.body).to.equal("object");
        done();
        if (err) console.log("error");
      });
    });
    it(".lengthが一致しているか？", (done) => {
      request.get("/randomtest").end((err, res) => {
        expect(res.body.length).to.equal(1);
        done();
        if (err) console.log("error");
      });
    });
    it("idが数値型か？", (done) => {
      request.get("/randomtest").end((err, res) => {
        expect(typeof res.body[0].id).to.equal("number");
        done();
        if (err) console.log("error");
      });
    });
    it("imgURLがstring型か？", (done) => {
      request.get("/randomtest").end((err, res) => {
        expect(typeof res.body[0].imgURL).to.equal("string");
        done();
        if (err) console.log("error");
      });
    });
    it("engNameがstring型か？", (done) => {
      request.get("/randomtest").end((err, res) => {
        expect(typeof res.body[0].engName).to.equal("string");
        done();
        if (err) console.log("error");
      });
    });
    describe("GET /retry", () => {
      it("typeがobjectか？", (done) => {
        request.get("/retry").end((err, res) => {
          expect(typeof res.body).to.equal("object");
          done();
          if (err) console.log("error");
        });
      });
      it(".lengthが一致しているか？", (done) => {
        request.get("/retry").end((err, res) => {
          expect(res.body.length).to.equal(1);
          done();
          if (err) console.log("error");
        });
      });
      it("idが数値型か？", (done) => {
        request.get("/retry").end((err, res) => {
          expect(typeof res.body[0].id).to.equal("number");
          done();
          if (err) console.log("error");
        });
      });
      it("imgURLがstring型か？", (done) => {
        request.get("/retry").end((err, res) => {
          expect(typeof res.body[0].imgURL).to.equal("string");
          done();
          if (err) console.log("error");
        });
      });
      it("engNameがstring型か？", (done) => {
        request.get("/retry").end((err, res) => {
          expect(typeof res.body[0].engName).to.equal("string");
          done();
          if (err) console.log("error");
        });
      });
    });
  });
});
