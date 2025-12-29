const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    _id: ID!
    title: String!
    author: String!
    isbn: String!
    totalCopies: Int!
    availableCopies: Int!
  }

  type Borrow {
    _id: ID!
    book: Book!
    borrowedAt: String!
    returnedAt: String
    status: String!
  }

  type Query {
    books: [Book!]!
    borrowHistory: [Borrow!]!
  }

  type Mutation {
    borrowBook(bookId: ID!): String!
    returnBook(bookId: ID!): String!
  }
`;

module.exports = typeDefs;
