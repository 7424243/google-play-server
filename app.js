const express = require('express')
const morgan = require('morgan')
const playstore = require('./playstore-data')
const cors = require('cors')

const app = express()

app.use(morgan('common'))
app.use(cors())

app.get('/apps', (req, res) => {
    const {sort='', genres=''} = req.query
    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res.status(400).send('Sort must be one of rating or app')
        }
    }
    if(genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res.status(400).send('Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card.')
        }
    }
    let results = playstore.filter(app =>
        app.Genres.includes(genres))

    if(sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
        })
    }
    res.json(results)
})

module.exports = app