const Borrow = require('../models/borrow');
const Book = require('../models/book');

/**
 * Borrow a book
 */
const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        if (book.availableCopies < 1) {
            return res.status(400).json({
                message: 'Book is not available',
            });
        }

        await Borrow.create({
            user: userId,
            book: bookId,
        });

        book.availableCopies -= 1;
        await book.save();

        return res.status(200).json({
            message: 'Book borrowed successfully',
        });
    } catch (err) {
        // Handles duplicate active borrow (unique index)
        if (err.code === 11000) {
            return res.status(400).json({
                message: 'You have already borrowed this book',
            });
        }

        console.error('Borrow error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Return a book
 */
const returnBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const borrowRecord = await Borrow.findOne({
            user: userId,
            book: bookId,
            status: 'BORROWED',
        });

        if (!borrowRecord) {
            return res.status(400).json({
                message: 'No active borrow record found',
            });
        }

        borrowRecord.status = 'RETURNED';
        borrowRecord.returnedAt = new Date();
        await borrowRecord.save();

        const book = await Book.findById(bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        return res.status(200).json({
            message: 'Book returned successfully',
        });
    } catch (err) {
        console.error('Return error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get borrow history for logged-in member
 */
const getBorrowHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await Borrow.find({ user: userId })
            .populate('book', 'title author isbn')
            .sort({ borrowedAt: -1 });

        return res.status(200).json({
            count: history.length,
            history,
        });
    } catch (err) {
        console.error('History error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    borrowBook,
    returnBook,
    getBorrowHistory,
};
