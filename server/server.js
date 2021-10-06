// Server imports
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// Instantiate express app and assign port
const app = express();
const PORT = process.env.PORT || 3001;

// Configure app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Import, instantiate Apollo server and params
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const server = new ApolloServer({ typeDefs, resolvers, context: authMiddleware });

// Connect Apollo server with Express app
server.applyMiddleware({ app });

// If in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// App listener
db.once('open', () => {
  app.listen( PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  })
});
