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
  type Mutation {
    createUser(createUserInput: CreateUserInput!): UserReturn
  }
  input CreateUserInput {
    name: String!
    email: String!
    signUpReferralCode: String
  }
  type UserReturn {
    user: User
    error: Error
  }
  type Error {
    message: String
  }
`
