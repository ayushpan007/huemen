const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },

        borrowedAt: {
            type: Date,
            default: Date.now,
        },

        returnedAt: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ['BORROWED', 'RETURNED'],
            default: 'BORROWED',
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Ensure one active borrow per user per book
 */
borrowSchema.index(
    { user: 1, book: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'BORROWED' } }
);

module.exports = mongoose.model('Borrow', borrowSchema);
