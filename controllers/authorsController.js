const Author = require('../models/authorModel')
const Book = require('../models/bookModel')

// Get All Authors
const getAuthors = async(req, res) => {
    let searchOptions = {}
    if (req.query.name !== null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render("authors/index", { 
            authors,
            searchOptions: req.query 
            })
    } catch {
        res.redirect('/')
    }
}

// New Authors Route
const newAuthorRoute = (req, res) => {
    res.render('authors/new', { author: new Author() })
}

//Get Single Author
const getAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author,
            booksByAuthor: books
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const createAuthor =  async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author,
            errorMessage: 'Error Creating Author'
        })
    }
}

const editAuthorRoute = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author })
    } catch (error) {
        console.log(error)
        res.redirect('/authors')
    }
}

const editAuthor = async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        console.log(error)
        if (author === null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author,
                errorMessage: 'Error updating Author'
            })
        }
    }
}

const deleteAuthor = async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch (error){
        console.log(error)
        if (author === null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
}


module.exports = {
    getAuthors,
    newAuthorRoute,
    getAuthor,
    createAuthor,
    editAuthorRoute,
    editAuthor,
    deleteAuthor
}