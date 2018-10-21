const typeDefs = require('./typeDefs')
const { makeExecutableSchema } = require('graphql-tools')
const merge = require('lodash.merge')

const types = require('./types')

const protoResolvers = [types]

const resolvers = merge(...protoResolvers)

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema