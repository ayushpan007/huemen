const Book = require('../models/book');

/**
 * Create a new book (Admin only)
 */
const createBook = async (req, res) => {
    try {
        const { title, author, isbn, totalCopies } = req.body;

        if (!title || !author || !isbn || !totalCopies) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(409).json({
                message: 'Book with this ISBN already exists',
            });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            totalCopies,
            availableCopies: totalCopies,
        });

        return res.status(201).json({
            message: 'Book created successfully',
            book,
        });
    } catch (err) {
        console.error('Create book error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get all books (Admin & Member)
 */
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        return res.status(200).json({
            count: books.length,
            books,
        });
    } catch (err) {
        console.error('Get books error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Update book details (Admin only)
 */
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        Object.assign(book, req.body);
        await book.save();

        return res.status(200).json({
            message: 'Book updated successfully',
            book,
        });
    } catch (err) {
        console.error('Update book error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Delete book (Admin only)
 */
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        await book.deleteOne();

        return res.status(200).json({
            message: 'Book deleted successfully',
        });
    } catch (err) {
        console.error('Delete book error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
};
