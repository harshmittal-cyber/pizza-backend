let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js')

//Assertion style
chai.should();
chai.use(chaiHttp);


describe(`All tasks should be done successfully`, () => {
    describe('GET /api/category/get/:storeId', () => {
        it('it should  return all catgeories by storeId', (done) => {
            const storeId = "6237f747c0204d3b9a36bdc2";
            chai.request(server)
                .get(`/api/category/get/${storeId}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.shoulf.have.property('storeId').eq('6237f747c0204d3b9a36bdc2')
                    done()
                })
        })
    })
})