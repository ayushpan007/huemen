const express = require('express');
const router = express.Router();
const pingRoutes = require('./ping');
const authRoutes = require('./auth');
const bookRoutes = require('./book');
const borrowRoutes = require('./borrow');
const reportRoutes = require('./report');

reportRoutes(router);
bookRoutes(router);
borrowRoutes(router);
authRoutes(router);
pingRoutes(router);

module.exports = router;