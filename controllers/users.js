const { User } = require('../models')
const errors = require('../errors')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)

exports.createUser = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['name', 'email'])
  if (validationError) return res.status(400).send(validationError)
  const newUser = await User.build(req.body)
  if (!newUser) {
    return res.status(400).send('Could not create user')
  }
  try {
    await newUser.save()
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: 'noah@stampedelive.com',
              },
            ],
            subject: 'Hello World from the SendGrid Node.js Library!',
          },
        ],
        from: {
          email: 'admin@stampedelive.com',
        },
        content: [
          {
            type: 'text/plain',
            value: 'Hello, Email!',
          },
        ],
      },
    })
    try {
      console.log(request)
      await sg.API(request)
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
