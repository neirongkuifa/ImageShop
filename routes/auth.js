const express = require('express')
const { param, body } = require('express-validator/check')
const User = require('../models/user')
const authController = require('../controllers/auth')

const router = express.Router()

//Login
router.get('/login', authController.getLogin)
router.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter a Valid Email.')
			.custom(async value => {
				const user = await User.findOne({ email: value })
				if (!user) {
					throw new Error('User does not exist.')
				}
				return true
			})
			.normalizeEmail(),
		body('password')
			.isLength({ min: 5 })
			.withMessage('Password Should be at Least 6 characters long.')
			.trim()
	],
	authController.postLogin
)

//Set New Password
router.get(
	'/reset/:resetToken',
	[
		param('resetToken').custom(async (value, { req }) => {
			const user = await User.findOne({
				'resetToken.token': value,
				'resetToken.expireDate': { $gt: Date.now() }
			})
			req.resetUser = user
			if (!user) {
				throw new Error('Please Request a new Link')
			}
			return true
		})
	],
	authController.getNewPassword
)
router.post(
	'/reset/:resetToken',
	[
		param('resetToken').custom(async (value, { req }) => {
			const user = await User.findOne({
				id: req.body.userId,
				'resetToken.token': value,
				'resetToken.expireDate': { $gt: Date.now() }
			})
			req.resetUser = user
			if (!user) {
				throw new Error('Please Request a new Link')
			}
			return true
		}),
		body(
			'password',
			'Password should be at least 6 characters long and should conly contain alphabets or numbers'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		body('confirmedPassword')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Confirmed Password Does not Match.')
				}
				return true
			})
			.trim()
	],
	authController.postNewPassword
)

//Send Reset Link
router.get('/reset', authController.getReset)
router.post(
	'/reset',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter a Valid Email.')
			.custom(async value => {
				const user = await User.findOne({ email: value })
				if (!user) {
					throw new Error('User does not exist.')
				}
				return true
			})
			.normalizeEmail()
	],
	authController.postReset
)

//Signup
router.get('/signup', authController.getSignup)
router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter a Valid Email.')
			.normalizeEmail()
			.custom(async value => {
				const user = await User.findOne({ email: value })
				if (user) {
					throw new Error('User already exists!')
				}
				return true
			}),
		body(
			'password',
			'Password should be at least 6 characters long and should conly contain alphabets or numbers'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		body('confirmedPassword')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Confirmed Password does not match')
				}
				return true
			})
			.trim()
	],
	authController.postSignup
)

//Logout
router.post('/logout', authController.postLogout)

module.exports = router
