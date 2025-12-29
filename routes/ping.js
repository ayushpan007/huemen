const { ping } = require('../controller/ping');

module.exports = (router) => {
    router.get('/ping', ping);
};