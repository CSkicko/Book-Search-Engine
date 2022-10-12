const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// Import dependencies and set up apollo server
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

// Create a function to initiate the apollo server connection and start the app
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`GraphQL URL: http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// Start the apollo server by calling the function
startApolloServer(typeDefs, resolvers);