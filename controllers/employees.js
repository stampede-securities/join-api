const { Employee, User } = require('../models/')
const config = require('../config')
const jwt = require('jwt-simple')
const errors = require('../errors.js')

exports.createEmployee = async (req, res) => {
  const validationError = errors.missingFields(req.body, [
    'hash',
    'name',
    'email',
  ])
  if (validationError) return res.status(400).send(validationError)
  const newEmployee = await Employee.build(req.body)
  if (!newEmployee) {
    return res.status(400).send('Could not create employee')
  }

  return newEmployee
    .save()
    .then(employee => {
      const payload = { id: employee.id }
      const token = jwt.encode(payload, config.tokenSecret)
      employee.token = token
      return employee.save().then(() => res.json({ token }))
    })
    .catch(err => {
      let message = ''
      if (err.message === 'Validation error') {
        message = 'An employee with this email already exists'
      }
      return res.status(400).send(`Error: ${message || err.message}`)
    })
}

exports.getAllEmployees = async (_, res, next) => {
  try {
    const employees = await Employee.findAll({})
    return res.json(employees)
  } catch (err) {
    return next(err)
  }
}

exports.getEmployeeById = (req, res) => {
  req.employee.hash = undefined
  req.employee.token = undefined
  return res.json(req.employee)
}

exports.updateEmployee = async (req, res, next) => {
  const { employee } = req
  if (req.body.email) employee.email = req.body.email
  if (req.body.name) employee.name = req.body.name
  try {
    await employee.save()
    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}

exports.deleteEmployee = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['userId'])
  if (validationError) return res.status(400).send(validationError)
  try {
    await User.destroy({
      where: { id: req.body.userId },
    })
    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}
