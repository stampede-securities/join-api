const auth = require('../controllers/auth')
const employees = require('../controllers/employees')
const users = require('../controllers/users')
const express = require('express')

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

/*
 * User Routes
 */
router.route('/users').post(users.createUser)
router.route('/users/all').get(users.getAllUsers)

/*
 * Auth Routes
 */
router.route('/auth/login').post(auth.loginEmployee)
router
  .route('/auth/forgot')
  .post(auth.sendResetToken)
  .put(auth.resetPassword)

// expose routes through router object
module.exports = router
