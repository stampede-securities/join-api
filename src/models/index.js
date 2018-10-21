const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../../config').db[env]

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

const db = {}
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db