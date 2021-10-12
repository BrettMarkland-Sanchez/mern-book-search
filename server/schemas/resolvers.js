const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      };
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
        if (!user) throw new AuthenticationError('No user found with this email address');
      const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) throw new AuthenticationError('Incorrect credentials');
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { bookId, authors,  description, image, link, title }, context) => {
      if (context.user) {
        const userData = await User.findOneAndUpdate({ _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors,  description, image, link, title }}},
          { new: true, runValidators: true }
        );
        return userData;
      };
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const userData = await User.findOneAndUpdate({ _id: context.user._id },
          { $pull: { savedBooks: { bookId }}},
          { new: true }
        );
        return userData;
      };
      throw new AuthenticationError('You need to be logged in!');
    },
  }
};

module.exports = resolvers;