const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const models = require('./models')
const config = require('./config')
const routes = require('./routes')

const app = express()

// run init script
if (app.get('env') !== 'production') app.use(logger('dev'))

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

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

// handle 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// development error handler
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).send()
  })
}

// production error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send()
})

models.sequelize.sync().then(() => {
  const server = app.listen(config.port)
  console.log(
    'Listening at http://localhost:%s in %s mode',
    server.address().port,
    app.get('env'),
  )
})
