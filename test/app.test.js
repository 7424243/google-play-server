const supertest = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('GET /apps endpoint', () => {
    it('should return an array of apps', () => {
        return supertest(app).get('/apps').expect(200).expect('Content-Type', /json/).then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body).to.have.lengthOf.at.least(1)
            const app = res.body[0]
            expect(app).to.include.all.keys('App', 'Rating', 'Genres')
        })
    })
    it('should be 400 if sort is incorrect', () => {
        return supertest(app).get('/apps').query({sort: 'MISTAKE'}).expect(400, 'Sort must be one of rating or app')
    })
    it('should be 400 if genres is incorrect', () => {
        return supertest(app).get('/apps').query({genres: 'MISTAKE'}).expect(400, 'Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card.')
    })
    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let sorted = true;
                let i = 0
                while (i < res.body.length -1) {
                    const appAtI = res.body[i]
                    const appAtIPlus1 = res.body[i + 1]
                    if(appAtIPlus1.Rating < appAtI.rating) {
                        sorted = false
                        break
                    }
                    i++
                }
                expect(sorted).to.be.true
            })
    })
    it('should display apps with Puzzle genre', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: 'Puzzle'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let result = res.body
                let apps = []
                result.forEach(function(e) {
                    apps.push(e.Genres)
                })
                expect(apps).to.have.members(['Puzzle', 'Puzzle'])
            })
    })
})