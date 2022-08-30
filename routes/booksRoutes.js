const express = require('express');
const router = express.Router();

const { 
    getBooks, 
    newBooksRoute,
    createBook,
    getBook,
    editBook,
    updateBook,
    deleteBook,
 } = require('../controllers/booksController')

// All Books Route
router.get('/', getBooks)

// New Book Route
router.get('/new', newBooksRoute)

// Create Book Route
router.post('/', createBook)

// Show Book Route
router.get('/:id', getBook)

// Edit Book Route
router.get('/:id/edit', editBook)

// Update Book Route
router.put('/:id', updateBook)

// Delete Book Route
router.delete('/:id', deleteBook)

module.exports = router