
'use strict';

const request = require('supertest');
const app = require('./app');

function checkDeliaDerbyshire(res)
{

    const jContent = res.body;
    if(typeof jContent !== 'object'){
	throw new Error('not an object');
    }

    if(jContent['surname'] !== 'Derbyshire'){
	console.log(jContent);
	throw new Error('surname should be Derbyshire');
    }

    if(jContent['forename'] !== 'Delia'){
	throw new Error('forename should be Delia');
    }
}

describe('it the people service', () => {
    it('GET /people succeeds', () => {
        return request(app)
	    .get('/people')
	    .expect(200);
    });

    it('GET /people returns JSON', () => {
        return request(app)
	    .get('/people')
	    .expect('Content-type', /json/);
    });

    it('GET /people includes doctorwhocomposer', () => {
        return request(app)
	    .get('/people')
	    .expect(/doctorwhocomposer/);
    });

    it('GET /people/doctorwhocomposer succeeds', () => {
        return request(app)
	    .get('/people/doctorwhocomposer')
	    .expect(200);
    });

    it('GET /people/doctorwhocomposer returns JSON', () => {
        return request(app)
	    .get('/people/doctorwhocomposer')
	    .expect('Content-type', /json/);
    });

    it('GET /people/doctorwhocomposer includes name details', () => {
        return request(app)
	    .get('/people/doctorwhocomposer')
	    .expect(checkDeliaDerbyshire);
    });


    it('POST /people needs access_token', () => {
        return request(app)
	    .post('/people')
	    .set('username', 'bobthebuilder')
	    .set('forename', 'Bob')
	    .set('surname', 'Builder')
	    .expect(403);
    });

    it('POST /people cannot replicate', () => {
        return request(app)
	    .post('/people')
	    .set('access_token', 'concertina')
	    .set('username', 'doctorwhocomposer')
	    .set('forename', 'Bob')
	    .set('surname', 'Builder')
	    .expect(400);
    });

});
