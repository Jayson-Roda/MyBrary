const express = require('express')
const router = express.Router()
const getHomeIndex = require('../controllers/indexController')

router.get('/', getHomeIndex)

module.exports = router