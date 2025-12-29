const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { ApolloServer } = require('apollo-server-express');

const routes = require('./routes');
const { connectDB } = require('./config/db');
const { authMiddleware } = require('./middleware/auth');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const { port: PORT } = require('./config/env');

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};

const startServer = async () => {
    try {
        // DB
        await connectDB();

        // Global middleware
        app.use(helmet({ contentSecurityPolicy: false }));
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Apollo Server (STABLE VERSION)
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({
                user: req.user || null,
            }),
        });

        await apolloServer.start();

        app.use('/graphql', authMiddleware);
        apolloServer.applyMiddleware({ app, path: '/graphql' });

        // REST routes
        app.use('/', routes);

        // 404
        app.use((req, res) => {
            res.status(404).json({ message: 'Resource not found' });
        });

        // Error handler
        app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
};

startServer();
