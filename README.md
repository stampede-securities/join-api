# Api starter app
This app is meant to be used as a starting point for creating backend APIs.
The app is a simple express app with built in token authentication for users.

## Running

1. Clone the repository.
2. Run `npm install`.
3. If running in a dev environment, set up the mongo db.
    1. Create the following directory paths in your home folder:
        - `~/mongodb/<api-name>/data/db`
        - `~/mongodb/<api-name>/logs`
    3. Update the mongo conf file in `/models/mongod.conf`. The `path` and `dbpath` variables should point to paths you just created.
4. In a new terminal window run `npm run mongo` to start the mongdb database.
    1. In order to later stop the mongo database run `npm run mongo-stop`.
5. In the same window run `npm run start` to start the api.

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

## Routes

### Users

**Create User**
----
  Creates a new user.

* **URL**

  /users/

* **Method:**

  `POST`

*  **Headers**

  None

*  **URL Params**

  None

* **Data Params**

    **Required:**

  `name=string`

  `email=string`

  `password=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
    {
      "userId": "5a576538f22fdb5ad39e6774",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjVhNTc2NTM4ZjIyZmRiNWFkMzllNjc3NCIsImVtYWlsIjoidGVzdEB0ZXN0MTIuY29tIn0.AIMGU6aPwRDqFSU7y5yU3JVMS5xnJPNqylSTbrNp2oU"
    }
    ```

**Update User**
----
  Updates user data.

* **URL**

  /users/

* **Method:**

  `PUT`


*  **Headers**

    **Required:**

  `x-access-token=string`

*  **URL Params**

  None

* **Data Params**

    **Optional:**

  `name=string`

  `email=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `OK`


**Get User**
----
  Get data for the logged in user.

* **URL**

  /users/

* **Method:**

  `GET`


*  **Headers**

    **Required:**

  `x-access-token=string`

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    {
      "_id": "5a578674037d3d759b4ac397",
      "updatedDate": "2018-01-11T15:45:03.710Z",
      "createdDate": "2018-01-11T15:44:52.395Z",
      "name": "Timmy Tamm",
      "email": "test@test12.com",
      "admin": false
    }
    ```

## Auth

**Login user**
----
  Logs in the user.

* **URL**

  /auth/login

* **Method:**

  `POST`

*  **Headers**

  None
  
*  **URL Params**

  None

* **Data Params**

    **Required:**

  `email=string`

  `password=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjVhNGNlNTBjM2FhY2Y5MGNmNzBhYTdlYiIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSJ9.wpAiH_Qu4dgM_la2rMcVL4pZpTcX8V61D_HTAmb1TX4",
      "userId": "5a4ce50c3aacf90cf70aa7eb"
    }
    ```

**Change password**
----
  Change the password for the logged in user

* **URL**

  /auth/changePassword

* **Method:**

  `PUT`

*  **Headers**

    **Required:**

  `x-access-token=string`
  
*  **URL Params**

  None

* **Data Params**

    **Required:**

  `oldPassword=string`

  `newPassword=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `OK`


**Reset password**
----
  Reset the password for the logged in user

* **URL**

  /auth/resetPassword

* **Method:**

  `POST`

*  **Headers**

  None

*  **URL Params**

  None

* **Data Params**

    **Required:**

  `email=string`

  `token=string`

  `newPassword=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `OK`

**Send password reset token**
----
  Sends an email to the user associated with the given email containing a password reset token. 

* **URL**

  /auth/sendResetToken

* **Method:**

  `POST`

*  **Headers**

  None

*  **URL Params**

  None

* **Data Params**

    **Required:**

  `email=string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `OK`


