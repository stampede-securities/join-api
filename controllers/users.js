const { User } = require('../models')
const errors = require('../errors')

exports.createUser = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['name', 'email'])
  if (validationError) return res.status(400).send(validationError)
  const newUser = await User.build(req.body)
  if (!newUser) {
    return res.status(400).send('Could not create user')
  }
  try {
    await newUser.save()
    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}

exports.getAllUsers = async (_, res) => {
  const allUsers = await User.findAll({})
  return res.json(allUsers)
}
