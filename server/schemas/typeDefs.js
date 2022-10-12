const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        authors: [String]!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Query {
        user(id: ID!): User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): User
        saveBook(userId: ID!, book: ID!): Book
        deleteBook(bookId: String!): Book
    }
`

module.exports = typeDefs;