const env = {
    nodeEnv: process.env.NODE_ENV || 'development',

    port: process.env.PORT || 3000,

    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = env;
