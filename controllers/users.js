const { User } = require('../models')
const errors = require('../errors')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.createUser = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['name', 'email'])
  if (validationError) return res.status(400).send(validationError)
  const newUser = await User.build(req.body)
  if (!newUser) {
    return res.status(400).send('Could not create user')
  }
  try {
    await newUser.save()
    const msg = {
      to: 'noah@stampedelive.com',
      from: 'admin@stampedelive.com.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    try {
      console.log('executing send sgMail', sgMail.send)
      await sgMail.send(msg)
    } catch (err) {
      console.error('EMAIL SEND FAILED')
      console.error(err)
    }

    return res.sendStatus(200)
  } catch (err) {
    return next(err)
  }
}

exports.getAllUsers = async (_, res) => {
  const allUsers = await User.findAll({})
  return res.json(allUsers)
}
