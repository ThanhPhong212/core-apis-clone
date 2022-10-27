//During the test the env variable is set to test
process.env.NODE_ENV = "test";
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe("Test roles", () => {

    

    describe('/POST role', () => {

        let value = {
            "value": "ADMIN"
        };

        it("it should POST Role successful", (done) => {
            chai.request(server)
                .post("/api/role/create")
                .send(value)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status", true);
                    res.body.should.have.property("message");
                    res.body.should.have.property("data");
                done();
            });
        });

        let a = {
            "value": "ADMINssss"
        };
        it("it should NOT POST Role successful", (done) => {
            chai.request(server)
                .post("/api/role/create")
                .send(a)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property("status", false);
                    res.body.should.have.property("message");
                done();
            });
        });
    });

    describe('/GET role', () => {

        it("it should GET list role", (done) => {
            chai.request(server)
                .get("/api/roles")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status", true);
                    res.body.should.have.property("message");
                    res.body.should.have.property("data");
                    done();
            });
        });

        it("it should GET role by Id ", (done) => {
            let id=1;
            chai.request(server)
                .get("/api/roles/"+`${id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status", true);
                    res.body.should.have.property("message");
                    res.body.should.have.property("data");
                    done();
            });
        });

        it("it should Get list user by roleId ", (done) => {
            let id=7;
            chai.request(server)
                .get(`/api/roles/${id}/users`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status", true);
                    res.body.should.have.property("message");
                    res.body.should.have.property("data");
                    done();
            });
        }); 
    });
   
});
