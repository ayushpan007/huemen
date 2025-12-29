const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/roles');

const { borrowBook, returnBook, getBorrowHistory, } = require('../controller/borrow');

module.exports = (router) => {
    router.post('/borrow/:bookId', authMiddleware, roleMiddleware(['MEMBER']), borrowBook);
    router.post('/return/:bookId', authMiddleware, roleMiddleware(['MEMBER']), returnBook);
    router.get('/borrow/history', authMiddleware, roleMiddleware(['MEMBER']), getBorrowHistory);
}
