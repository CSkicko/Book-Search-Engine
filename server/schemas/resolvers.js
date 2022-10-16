const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
                return await User.findById(args._id).populate('savedBooks')
            };
            throw new AuthenticationError('You need to be signed in to view a profile!');
        }
    },
    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            // Sign the token when a user is created
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            // If no user exists, throw an error
            if (!user) {
                throw new AuthenticationError('No profile found!');
            };

            // Check the password
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError('Your password is incorrect, please try again!');
            }

            const token = signToken(user);

            return { token, user };
        },
        // Added authentication to saveBook
        saveBook: async (parent, { userId, book }, context) => {
            if (context.user) {
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
            }
            throw new AuthenticationError('You must log in to save a book!');
        },
        // Added authentication to deleteBook
        deleteBook: async (parent, { userId, book }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { savedBooks: book }},
                    { new: true }
                );
            }
            throw new AuthenticationError('You must log in to delete a book!');
        },
    },
};

module.exports = resolvers;