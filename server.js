if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRoutes = require('./routes/indexRoutes')
const authorsRoutes = require('./routes/authorsRoutes')
const booksRoutes = require('./routes/booksRoutes')

// MIDDLEWARE
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to mongoose"))

app.use('/', indexRoutes)
app.use('/authors', authorsRoutes)
app.use('/books', booksRoutes)

app.listen(process.env.PORT || 3000)
