const { createBook, getBooks, updateBook, deleteBook, } = require('../controller/book');

const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/roles');

module.exports = (router) => {
    router.post('/books', authMiddleware, roleMiddleware(['ADMIN']), createBook);
    router.put('/books/:id', authMiddleware, roleMiddleware(['ADMIN']), updateBook);
    router.delete('/books/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteBook);
    router.get('/', authMiddleware, getBooks);
};