const express = require('express')

const app = express()
const port = 5000
    // listen  on port 5000
const config = {
    views: 'views',
    static: 'public',
    logging: true,

}

const main = require('./src/routes/main')
app.use('/', main)
app.use(express.static('public'))
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.listen(port, () => console.log('Listneing on port' + port))

module.exports = app