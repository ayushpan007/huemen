const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        totalCopies: {
            type: Number,
            required: true,
            min: 1,
        },

        availableCopies: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Ensure availableCopies is never more than totalCopies
 */
bookSchema.pre('save', function (next) {
    if (this.availableCopies > this.totalCopies) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);
