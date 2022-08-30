const express = require('express')
const router = express.Router()

const { 
    getAuthors, 
    newAuthorRoute,
    getAuthor,
    createAuthor,
    editAuthorRoute,
    editAuthor,
    deleteAuthor, 
} = require ('../controllers/authorsController')

// All authors Route
router.get('/', getAuthors)

// New Author Route
router.get('/new', newAuthorRoute)

// Create Author Route
router.post('/', createAuthor)

// Get Single Author
router.get('/:id', getAuthor)

// Edit Author Route
router.get('/:id/edit', editAuthorRoute)

// Edit Single Author
router.put('/:id', editAuthor)

// Delete Single Author
router.delete('/:id', deleteAuthor)

module.exports = router