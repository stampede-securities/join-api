const gql = require('graphql-tag')

module.exports = gql`
  type Query {
    user(id: ID!): User
  }
  type User {
    id: ID!
    name: String!
    email: String!
    referralCode: String!
    signUpReferralCode: String
  }
  type Mutstion
`