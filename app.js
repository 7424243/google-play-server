const express = require('express')
const morgan = require('morgan')
const playstore = require('./playstore-data')

const app = express()

app.use(morgan('common'))

app.get('/apps', (req, res) => {
    const {sort='', genres=''} = req.query
    if(sort) {
        if(!['rating', 'app']) {
            return res.status(400).send('Sort must be one of rating or app')
        }
    }
    if(genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']) {
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

app.listen(8000, () => {
    console.log('Server started on PORT 8000')
})