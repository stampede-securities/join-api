const jwt = require('jwt-simple')
const crypto = require('crypto')
const { Employee } = require('../models')
const config = require('../config')
const errors = require('../errors.js')

exports.loginEmployee = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['email', 'password'])
  if (validationError) return res.status(400).send(validationError)

  try {
    const employee = await Employee.findOne({ email: req.body.email })
    if (!employee) {
      return res
        .status(400)
        .send(
          errors.makeError(errors.err.OBJECT_NOT_FOUND, { name: 'employee' }),
        )
    }
    const isMatch = await employee.comparePassword(req.body.password)
    if (!isMatch)
      return res
        .status(400)
        .send(errors.makeError(errors.err.INCORRECT_PASSWORD))

    // add relevant data to token
    const payload = {
      id: employee.id,
      email: employee.email,
    }

    const token = jwt.encode(payload, config.tokenSecret)
    employee.token = token
    await employee.save()
    return res.json({ token, accessLevel: employee.accessLevel })
  } catch (err) {
    return next(err)
  }
}

async function validateToken(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (!token)
    return res.status(400).send(errors.makeError(errors.err.NOT_AUTHENTICATED))
  let decoded
  try {
    decoded = jwt.decode(token, config.tokenSecret)
  } catch (err) {
    return res.status(400).send(errors.makeError(errors.err.INVALID_TOKEN))
  }
  if (!decoded.id)
    return res.status(400).send(errors.makeError(errors.err.INVALID_TOKEN))

  try {
    const employee = await Employee.findById(decoded.id)
    if (!employee) {
      return res.status(400).send(errors.makeError(errors.err.NO_USER))
    }
    if (token !== employee.token) {
      return res.status(400).send(errors.makeError(errors.err.INVALID_TOKEN))
    }
    req.employee = employee
    req.id = decoded.id
    return next()
  } catch (err) {
    return next(err)
  }
}

exports.validateEmployee = (req, res, next) => {
  validateToken(req, res, next, {})
}

exports.changePassword = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, [
    'oldPassword',
    'newPassword',
  ])
  if (validationError) return res.status(400).send(validationError)

  try {
    const employee = await Employee.findById(req.id)
    if (!employee) {
      return res
        .status(400)
        .send(errors.makeError(errors.err.NOT_AUTHENTICATED))
    }
    const isMatch = await employee.comparePassword(req.body.oldPassword)
    if (!isMatch)
      return res
        .status(400)
        .send(errors.makeError(errors.err.INCORRECT_PASSWORD))

    employee.hash = req.body.newPassword
    await employee.save()
    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, [
    'email',
    'token',
    'newPassword',
  ])
  if (validationError) return res.status(400).send(validationError)

  try {
    const employee = await Employee.find({ email: req.body.email })

    if (!employee) {
      return res.status(400).send(
        errors.makeError(errors.err.OBJECT_NOT_FOUND, {
          object: ['employee'],
        }),
      )
    }
    if (!employee.passwordToken || req.body.token !== employee.passwordToken) {
      return res.status(400).send(errors.makeError(errors.err.NOT_AUTHORIZED))
    }
    const hour = 60 * 60 * 1000
    if (Date.now() - employee.passwordTokenCreatedDate > hour) {
      return res.status(400).send(errors.makeError(errors.err.EXPIRED_TOKEN))
    }
    employee.hash = req.body.newPassword
    await employee.save()
    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}

exports.sendResetToken = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['email'])
  if (validationError) return res.status(400).send(validationError)
  const employee = await Employee.findOne({ email: req.body.email })
  if (!employee)
    return res.status(400).send(errors.makeError(errors.err.OBJECT_NOT_FOUND))

  let token

  try {
    token = await new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) return reject(err)
        return resolve(buf.toString('hex'))
      })
    })
  } catch (err) {
    return res.status(400).send(errors.makeError(errors.err.SERVER_ERROR))
  }
  employee.passwordToken = token
  employee.passwordTokenCreatedDate = Date.now()

  // employee.save(err => {
  //   if (err) return next(err)

  //   const msg = {
  //     to: employee.email,
  //     from: 'support@' + config.appDomain,
  //     subject: 'Recovering your ' + config.appName + ' password.',
  //     text:
  //       'Hi ' +
  //       employee.name +
  //       ',\n\nHere is your generated password reset token. Insert it into the password recovery modal on ' +
  //       config.appDomain +
  //       'to reset your password. If you did not request this, then ignore this email.\n\nToken: ' +
  //       token +
  //       '.',
  //     html:
  //       '<h1>Hi ' +
  //       employee.name +
  //       ',<h1><br><p>Here is your generated password reset token. Insert it into the password recovery modal on <a href=' +
  //       config.appDomain +
  //       '>' +
  //       config.appDomain +
  //       '</a> to reset your password. If you did not request this, then ignore this email.</p><br><p>Token: ' +
  //       token +
  //       '</p>'
  //   }
  //   sgMail.send(msg)
  return res.sendStatus(200)
  // })
}
