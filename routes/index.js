const auth = require('../controllers/auth')
const employees = require('../controllers/employees')
const express = require('express')
const users = require('../controllers/users')

const router = express.Router()

/*
 * Employee Routes
 */
router
  .route('/employees')
  .post(employees.createEmployee)
  .get(auth.validateEmployee, employees.getEmployeeById)
  .put(auth.validateEmployee, employees.updateEmployee)
  .delete(auth.validateEmployee, employees.deleteEmployee)

router
  .route('/employees/all')
  .get(auth.validateEmployee, employees.getAllEmployees)

/*
 * User Routes
 */
router.route('/users').post(users.createUser)
router.route('/users/all').get(auth.validateEmployee, users.getAllUsers)
router.route('/users/email/:email').get(users.getUserByEmail)

/*
 * Auth Routes
 */
router.route('/auth/login').post(auth.loginEmployee)
router
  .route('/auth/forgot')
  .post(auth.sendResetToken)
  .put(auth.resetPassword)

module.exports = router
