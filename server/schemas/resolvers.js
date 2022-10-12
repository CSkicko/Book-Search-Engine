const { User, Book } = require('../models');

const resolvers = {
    Query: {
        user: async (parent, args) => {
            return await User.findById(args._id).populate('savedBooks')
        }
    },
    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            return await User.create({ username, email, password });
        },
        saveBook: async (parent, { userId, book }) => {
            return await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: 
                    { savedBooks: book }
                },
                { 
                    new: true,
                    runValidators: true,
                }
            );
        },
        deleteBook: async (parent, { userId, book }) => {
            return await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { savedBooks: book }},
                { new: true }
            );
        },
    },
};

module.exports = resolvers;