# Api starter app

This app is meant to be used as a starting point for creating backend APIs.
The app is a simple express app with built in token authentication for users.

## Running

1. Clone the repository.
2. Run `npm install`.
3. If running in a dev environment, set up the PostgreSQL db by running `npm run setup-db`
4. In a new terminal window run `npm run db` to start the SQL database.
   1. In the CLI run `\i config/script.sql` to create the DB locally
5. In a different window run `npm run dev` to start the api

## Errors

The API returns errors on API calls that fail. The standard error format is:

```
{
  code: <error_code>,
  context: {},
  msg: <error_msg>
}
```

`code` is an error code that is relevant to the error.

`context` is a json object, which provides more info about the error. The fields in `context` are dependent on the error code.

`msg` is a human readable message describing the error.

### Error codes

#### NOT_AUTHENTICATED

- code: 1001
- context: `{}`
- msg: User not authenticated. Please log in or register.

#### NOT_AUTHORIZED

- code: 1002
- context: `{}`
- msg: User is not authorized.

#### INCORRECT_PASSWORD

- code: 1003
- context: `{}`
- msg: Incorrect password.

#### INVALID_TOKEN

- code: 1004
- context: `{}`
- msg: Passed in token is either invalid or expired.

#### INVALID_EMAIL

- code: 1005
- context: `{}`
- msg: The passed email is invalid.

#### EXISTING_EMAIL

- code: 1006
- context: `{}`
- msg: The passed email is already associated with a user.

#### EXPIRED_TOKEN

- code: 1007
- context: `{}`
- msg: The passed in token is expired.

#### MALFORMED_BODY

- code: 2001
- context:

```
{
  fields: <fields that are missing from the body or wrong>
}
```

- msg: The request body is missing certain fields or contains invalid values.

#### SERVER_ERROR

- code: 3001
- context: `{}`
- msg: There was an error on the server.

#### OBJECT_NOT_FOUND

- code: 5001
- context:

```
{
  name: <name of object that was not found>
}
```

- msg: A certain object was not found. Please check your inputs.
