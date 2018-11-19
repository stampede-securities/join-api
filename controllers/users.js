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
      to: req.body.email,
      from: 'Stampede Team<admin@stampedelive.com>',
      subject: 'Thank you from Stampede',
      html: `
      Hello ${req.body.name.split(' ')[0]},
      <br/>
      <p>
      Congratulations on being admitted into the Keros Club.  As a member, you will have early access to deals and content on the platform.  Here is the link to our full website: stampedelive.com.  We’ll be in touch with exclusive access to the first deals we are launching on our platform.  
      </p>
      <br/>
      Thank You,
      <br/>
      Stampede Team 
      `,
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
