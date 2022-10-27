//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const { User } = require('../models/index');
let server = require('../index');
let should = chai.should();
var expect = require('chai').expect

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    before(async (done) => {
        //Before each test we empty the database
        console.log("Vào đây trước");
        done();

        // User.destroy({}, (err) => {
        //     done();
        // });
    });
    after(async (done) => {
        console.log("Xong thì vào đây");
        await User.destroy({
            where: { userName: "Admin4" },
            truncate: { cascade: true },
        }, done())
    });
    /*
     * Test the /GET route
     */
    describe('/Test users', () => {

        let userSuccess = {
            "userName": "Admin4",
            "password": "12345678",
            "firstName": "Biện",
            "lastName": "Thanh Phong2",
            "roleId": 1
        };
        //Test đăng ký tài khoản thành công
        it('POST user success', (done) => {
            chai.request(server)
                .post('/api/user/register')
                .send(userSuccess)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', "");
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('role_id');
                    // res.body.data.role_id.should.not.exist;
                    done();
                });
        });
        //Test đăng ký tài khoản thành fail
        let userErr = {
            "userName": "Admin",
            "password": "12345678",
            "firstName": "Trần",
            "lastName": "Thanh Tú",
            "roleId": 1
        };
        it('POST user fail', (done) => {
            chai.request(server)
                .post('/api/user/register')
                .send(userErr)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', false);
                    res.body.should.have.property('message');
                    // res.body.data.role_id.should.not.exist;
                    done();
                });
        });

        let query = {
            "page": 2,
            "limit": 10,
            "first_name": "",
            "last_name": "",
            "createAt": "2022-10-11"
        };
        var a = Object.keys(query).map(key => key + '=' + query[key]).join('&');
        it('list user', (done) => {
            chai.request(server)
                .get('/api/users' + '?' + a)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('total_page');
                    res.body.should.have.property('data');
                    res.body.should.have.property('page');
                    res.body.should.have.property('limit');
                    res.body.should.have.property('isNext', false);
                    res.body.data.should.be.a('array').length(0, 10);
                    // res.body.data.length.should.not.equal(0);
                    // res.body.data[0].should.have.property('fullName');
                    done();
                });
        });
    });
});
