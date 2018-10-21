const { User } = require('../src/models')
const bcrypt = require('bcrypt')
const config = require('./')

for (let i = 0; i < 20; i += 1) {
  User.create({
    email: `asdlfj${Math.random()}@lkajsf.com`,
    password: bcrypt.hashSync('password', config.saltRounds),
  })
}