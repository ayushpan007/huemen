const { register, login, } = require('../controller/auth');

module.exports = (router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
};