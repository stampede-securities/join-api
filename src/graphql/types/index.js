const merge = require('lodash.merge')

const query = require('./Query')
const mutations = require('./Mutations')

const resolvers = [query, mutations]

module.exports = merge(...resolvers)
