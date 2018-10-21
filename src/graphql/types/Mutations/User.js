const { User } = require('../../models')

const makeCode = () => {
  if (localStorage.id) return localStorage.id
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  localStorage.id = text
  return text
}

const createUser = async function createUser(obj, { createUserInput }) {
  const newUser = await User.build({ code: makeCode(), ...createUserInput })
  if (!newUser) {
    return {
      error: {
        message: 'Invalid input format.',
      },
    }
  }

  const hash = bcrypt.hashSync(
    createUserInput.password,
    config.server.saltRounds,
  )
  newUser.password = hash

  return newUser
    .save()
    .then(user => {
      const payload = { id: user.id }
      const token = jwt.sign(payload, config.server.tokenSecret)
      return {
        user,
        token,
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
          message,
        },
      }
    })
}

const resolver = {
  Mutation: {
    createUser,
  }
}

module.exports = resolver