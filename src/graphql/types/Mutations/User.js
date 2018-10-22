const { User } = require('../../../models')

const makeCode = () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

const createUser = async function createUser(obj, { createUserInput }) {
  const user = await User.find({ where: { email: createUserInput.email } })
  if (user) return { user, error: null }

  const newUser = await User.build({
    ...createUserInput,
    referralCode: makeCode(),
  })
  if (!newUser) {
    return {
      error: {
        message: 'Invalid input format.',
      },
    }
  }

  return newUser
    .save()
    .then(user => {
      return {
        user,
        error: null,
      }
    })
    .catch(err => {
      let message = ''
      if (err.message === 'Validation error') {
        message = 'A user with this email already exists'
      }
      return {
        error: {
          message: message || err.message,
        },
      }
    })
}

const resolver = {
  Mutation: {
    createUser,
  },
}

module.exports = resolver
