const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/roles');
const { getMostBorrowedBooks, getActiveMembers, getBookAvailability, } = require('../controller/report');

module.exports = (router) => {
    router.get('/reports/most-borrowed-books', authMiddleware, roleMiddleware(['ADMIN']), getMostBorrowedBooks);
    router.get('/reports/active-members', authMiddleware, roleMiddleware(['ADMIN']), getActiveMembers);
    router.get('/reports/book-availability', authMiddleware, roleMiddleware(['ADMIN']), getBookAvailability)
};