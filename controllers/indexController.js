const Book = require('../models/bookModel')

const getHomeIndex = async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch (error) {
        books = []
    }
    res.render("index", { books })
}

module.exports = getHomeIndex