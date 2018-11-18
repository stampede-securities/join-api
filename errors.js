const makeError = (error, context = {}) => {
  return {
    code: error.code,
    context: context,
    msg: error.msg,
  }
}

const err = {
  NOT_AUTHENTICATED: {
    code: 1001,
    msg: 'User not authenticated. Please log in or register.',
  },
  NOT_AUTHORIZED: {
    code: 1002,
    msg: 'User is not authorized.',
  },
  INCORRECT_PASSWORD: {
    code: 1003,
    msg: 'Incorrect password',
  },
  INVALID_TOKEN: {
    code: 1004,
    msg: 'Passed in token is either invalid or expired.',
  },
  INVALID_EMAIL: {
    code: 1005,
    msg: 'The passed email is invalid.',
  },
  EXISTING_EMAIL: {
    code: 1006,
    msg: 'The passed email is already associated with a user.',
  },
  EXPIRED_TOKEN: {
    code: 1007,
    msg: 'The passed in token is expired.',
  },
  MALFORMED_BODY: {
    code: 2001,
    msg:
      'The request body is missing certain fields or contains invalid values.',
  },
  SERVER_ERROR: {
    code: 3001,
    msg: 'There was an error on the server.',
  },
  OBJECT_NOT_FOUND: {
    code: 5001,
    msg: 'A certain object was not found. Please check your inputs.',
  },
}

exports.missingFields = (body, fields) => {
  const missingFields = []
  for (let i = 0; i < fields.length; i += 1)
    if (
      body[fields[i]] === undefined ||
      (typeof body[fields[i]] === 'string' && body[fields[i]] === '')
    )
      missingFields.push(fields[i])

  if (missingFields.length > 0)
    return makeError(err.MALFORMED_BODY, { fields: missingFields })
  return null
}

exports.makeError = makeError
exports.err = err
