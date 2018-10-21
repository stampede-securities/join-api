const merge = require('lodash.merge')

const query = require('./Query')

const resolvers = [query]

module.exports = merge(...resolvers)