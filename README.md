# Stampede API

## Project Structure
The repo was built by the general API file structure conventions we user at DEV.  It implements JWT-based authentication, with a basic user model and typedef.  It has a full devloper environment with prettier/eslint/travis set up.

This repository was designed first and foremost to **scale** to large projects.  It should be easy to extend the base file structure and setup here to much larger projects.

## Set up
```bash
$ npm run setup # When it prompts for password, enter the password: 'adminpw' (no quotations)
```
## Running
In one terminal window, enter psql:
```bash
$ npm run db
```
Once you have entered the postgres CLI, run the init script 
```
<your_project_db>=# \i config/script.sql
````
Now in another window, initialize our database and server:
```bash
$ npm start
```
Now go to `localhost:5000/` and you should be ready to start interacting with the API!

## Populating the Database
In order to ensure the database is filled correctly, you should run the following steps:

1. Terminate the existing server and database (ctrl + c)
2. In a terminal window, execute:
```bash
$ npm run db
```
3. Once you have entered the postgres CLI, run the init script
```
<your_project_db>=# \i config/script.sql
```
4. In another terminal window, run the following to populate the database:
```bash
$ npm run generate-mock-db-data
```
This will push mock data to the database
