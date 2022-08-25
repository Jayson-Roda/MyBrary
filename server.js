if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index')

// MIDDLEWARE
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('DB Connect Listening to Port', process.env.PORT)
        })
    })

app.use('/', indexRouter)
