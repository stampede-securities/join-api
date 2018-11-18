const config = require('../config')
const bcrypt = require('bcrypt')

module.exports = function defineEmployee(sequelize, DataTypes) {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    refCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    accessLevel: {
      type: DataTypes.ENUM,
      values: ['SALES', 'ADMIN'],
    },
  })

  // Methods
  Employee.prototype.comparePassword = function comparePassword(pw) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pw, this.hash, (err, isMatch) => {
        if (err) return reject(err)
        return resolve(isMatch)
      })
    })
  }

  // Hooks
  function encryptPasswordIfChanged(employee) {
    if (employee.changed('hash')) {
      employee.hash = bcrypt.hashSync(employee.hash, config.saltRounds)
    }
  }

  Employee.beforeCreate(encryptPasswordIfChanged)
  Employee.beforeUpdate(encryptPasswordIfChanged)

  return Employee
}
