const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { createServer } = require('http')

const models = require('./src/models')
const schema = require('./src/graphql')
const config = require('./config')

const force = process.argv[2] === '--force'

const app = express()

// Middleware to handle CORS
app.use((req, res, next) => {
  let oneof = false
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    oneof = true
  }
  if (req.headers['access-control-request-method']) {
    res.header(
      'Access-Control-Allow-Methods',
      req.headers['access-control-request-method'],
    )
    oneof = true
  }
  if (req.headers['access-control-request-headers']) {
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'],
    )
    oneof = true
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365)
  }
  if (oneof && req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  return next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async req => {
    const token = req.headers.authorization
    if (token) {
      const decoded = jwt.verify(token, config.tokenSecret)
      const user = await models.User.findById(decoded.id)
      return {
        schema,
        context: {
          user,
        },
      }
    }
    return {
      schema,
    }
  }),
)
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  })
)

models.sequelize.sync({ force }).then(() => {
  const server = createServer(app)
  server.listen(config.port, () => {
    console.log(
      `Apollo Server is now running on http://localhost:${config.port}`,
    )
  })
})