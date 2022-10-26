const { query } = require("express");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const app = express();

const authors = [
  { id: 1, name: "J.K Rollowing" },
  { id: 2, name: "Adolf Hitler" },
  { id: 3, name: "Thomas Edison" },
];

const books = [
  { id: 1, name: "how to fast and pray", authorId: 1 },
  { id: 2, name: "how to trade the currency market", authorId: 3 },
  { id: 3, name: "how to code", authorId: 2 },
  { id: 4, name: "understanding software engineering", authorId: 2 },
  { id: 5, name: "graphQL basics", authorId: 3 },
  { id: 6, name: "speaking in the holy ghost", authorId: 2 },
  { id: 7, name: "the art and principles of javascript", authorId: 1 },
  { id: 8, name: "the concept of Godly marriage", authorId: 3 },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: " A single Book",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "List of Single Authors",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.Id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a Book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an Author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: (parent, args) => {
        const author = { id: autnhors.length + 1, name: args.name };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("server is running now effectively 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀💥"));
