const Book = require('../models/book');
const Borrow = require('../models/borrow');

const resolvers = {
    Query: {
        books: async () => {
            return Book.find().sort({ createdAt: -1 });
        },

        borrowHistory: async (_, __, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            return Borrow.find({ user: context.user.id })
                .populate('book')
                .sort({ borrowedAt: -1 });
        },
    },

    Mutation: {
        borrowBook: async (_, { bookId }, context) => {
            if (!context.user || context.user.role !== 'MEMBER') {
                throw new Error('Access denied');
            }

            const book = await Book.findById(bookId);
            if (!book || book.availableCopies < 1) {
                throw new Error('Book not available');
            }

            await Borrow.create({
                user: context.user.id,
                book: bookId,
            });

            book.availableCopies -= 1;
            await book.save();

            return 'Book borrowed successfully';
        },

        returnBook: async (_, { bookId }, context) => {
            if (!context.user || context.user.role !== 'MEMBER') {
                throw new Error('Access denied');
            }

            const borrow = await Borrow.findOne({
                user: context.user.id,
                book: bookId,
                status: 'BORROWED',
            });

            if (!borrow) {
                throw new Error('No active borrow found');
            }

            borrow.status = 'RETURNED';
            borrow.returnedAt = new Date();
            await borrow.save();

            const book = await Book.findById(bookId);
            if (book) {
                book.availableCopies += 1;
                await book.save();
            }

            return 'Book returned successfully';
        },
    },
};

module.exports = resolvers;
