const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const getBooks = async (req, res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
}

const newBooksRoute = async (req, res) => {
    renderNewPage(res, new Book())
}

const createBook = async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch (error) {
        console.log(error)
        renderNewPage(res, book, true)
    }
}

const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec()
        res.render('books/show', { book })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const editBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        res.redirect('/')
    }
}

const updateBook = async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error){
        console.log(error)
        if(book != null){
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }
    }
}

const deleteBook = async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch (error) {
        console.log(error)
        if(book != null){
            res.render('book/show', {
                book,
                errorMessage: 'Could not remove Book'
            })
        } else {
            res.redirect('/')
        }
    }
}

// Helper Function
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError){
    try {
        const authors = await Author.find({})
        const params = {
            authors,
            book
        }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Editing Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }

        }
        res.render(`books/${form}`, params)
    } catch (error) {
        console.log(error)
        res.redirect('/books')
    }
}

module.exports = {
    getBooks,
    newBooksRoute,
    createBook,
    getBook,
    editBook,
    updateBook,
    deleteBook
}