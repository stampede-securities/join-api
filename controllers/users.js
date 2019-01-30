const { User } = require('../models')
const errors = require('../errors')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const makeCode = () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

exports.createUser = async (req, res, next) => {
  const validationError = errors.missingFields(req.body, ['name', 'email'])
  if (validationError) return res.status(400).send(validationError)
  const newUser = await User.build({ refCode: makeCode(), ...req.body })
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
      <p>
      Use the following link to share with friends and get more rewards: https://www.join.stampedelive.com/?code=${
        newUser.refCode
      }
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
    return res.json(newUser)
  } catch (err) {
    return next(err)
  }
}

exports.getAllUsers = async (_, res) => {
  const allUsers = await User.findAll({})
  const users = await Promise.all(
    allUsers.map(async user => {
      const signedUpUsers = await User.findAll({
        where: {
          signUpRefCode: user.refCode,
        },
      })
      return {
        usersSignedUp: signedUpUsers.length,
        name: user.name,
        email: user.email,
        refCode: user.refCode,
        signUpRefCode: user.signUpRefCode,
        createdAccount: user.createdAccount,
        createdAt: new Date(user.createdAt).toString(),
      }
    }),
  )
  return res.json(users)
}

exports.getUserByEmail = async (req, res) => {
  const user = await User.find({ where: { email: req.params.email } })
  const signedUpUsers = await User.findAll({
    where: {
      signUpRefCode: user.refCode,
    },
  })
  res.json({
    usersSignedUp: signedUpUsers.length,
    name: user.name,
    email: user.email,
    refCode: user.refCode,
    signUpRefCode: user.signUpRefCode,
    createdAccount: user.createdAccount,
  })
}
