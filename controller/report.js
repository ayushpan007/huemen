const Borrow = require('../models/borrow');
const Book = require('../models/book')

/**
 * Most borrowed books
 */
const getMostBorrowedBooks = async (req, res) => {
    try {
        const result = await Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    borrowCount: { $sum: 1 },
                },
            },
            {
                $sort: { borrowCount: -1 },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $unwind: '$book',
            },
            {
                $project: {
                    _id: 0,
                    bookId: '$book._id',
                    title: '$book.title',
                    author: '$book.author',
                    isbn: '$book.isbn',
                    borrowCount: 1,
                },
            },
        ]);

        return res.status(200).json({
            count: result.length,
            books: result,
        });
    } catch (err) {
        console.error('Most borrowed error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Most active members
 */
const getActiveMembers = async (req, res) => {
    try {
        const result = await Borrow.aggregate([
            {
                $group: {
                    _id: '$user',
                    borrowCount: { $sum: 1 },
                },
            },
            {
                $sort: { borrowCount: -1 },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 0,
                    userId: '$user._id',
                    name: '$user.name',
                    email: '$user.email',
                    borrowCount: 1,
                },
            },
        ]);

        return res.status(200).json({
            count: result.length,
            members: result,
        });
    } catch (err) {
        console.error('Active members error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Book availability overview
 */
const getBookAvailability = async (req, res) => {
    try {
        const books = await Book.find().select(
            'title author isbn totalCopies availableCopies'
        );

        return res.status(200).json({
            count: books.length,
            books,
        });
    } catch (err) {
        console.error('Availability error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    getMostBorrowedBooks,
    getActiveMembers,
    getBookAvailability,
};
