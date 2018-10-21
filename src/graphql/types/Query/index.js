const merge = require('lodash.merge')

const investment = require('./investment')

const resolvers = [investment]

module.exports = merge(...resolvers)