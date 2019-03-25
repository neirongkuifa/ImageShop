const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')
const nodemailer = require('nodemailer')
const sgTrans = require('nodemailer-sendgrid-transport')

const User = require('../models/user')

const transporter = nodemailer.createTransport(
	sgTrans({
		auth: {
			api_key:
				'***REMOVED***'
		}
	})
)

//Login
exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		active: req.url,
		pageTitle: 'Login',
		errMsg: req.flash('error')
	})
}

exports.postLogin = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.render('auth/login', {
				active: req.url,
				pageTitle: 'Login',
				errMsg: errors.array()[0].msg,
				oldInput: {
					email: req.body.email
				}
			})
		}

		const user = await User.findOne({ email: req.body.email })
		const authPass = await bcrypt.compare(req.body.password, user.password)
		if (authPass) {
			req.session.isLoggedIn = true
			req.session.user = req.body.email
			req.session.save(err => {
				if (err) console.log(err)
				return res.redirect('/')
			})
		} else {
			req.flash('error', 'Invalid Password')
			req.session.save(err => {
				if (err) console.log(err)
				res.redirect('/login')
			})
		}
	} catch (err) {
		console.log(err)
	}
}

//Reset
exports.getReset = (req, res, next) => {
	res.render('auth/reset', {
		active: req.url,
		pageTitle: 'Reset Password',
		errMsg: req.flash('error')
	})
}

exports.postReset = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.render('auth/reset', {
				active: req.url,
				pageTitle: 'Reset Password',
				errMsg: errors.array()[0].msg,
				oldInput: req.body.email
			})
		}
		const user = await User.findOne({ email: req.body.email })
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				console.log(err)
			} else {
				const token = buffer.toString('hex')
				user.resetToken = { token, expireDate: Date.now() + 3600000 }
				await user.save()
				transporter.sendMail({
					from: 'abel@imageshop.com',
					to: req.body.email,
					subject: 'Reset Password',
					html: `
						<p>You requested a password reset</p>
						<p>Here is the reset <a href="http://localhost:3000/reset/${token}">link</a></p>
						`
				})
				res.redirect('/')
			}
		})
	} catch (err) {
		console.log(err)
	}
}

//Set New Password
exports.getNewPassword = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			req.flash('error', errors.array()[0].msg)
			req.session.save(err => {
				if (err) console.log(err)
				return res.redirect('/reset')
			})
			return
		}

		res.render('auth/new-password', {
			active: req.url,
			pageTitle: 'New Password',
			errMsg: req.flash('error'),
			resetToken: req.params.resetToken,
			id: req.resetUser.id
		})
	} catch (err) {
		console.log(err)
	}
}

exports.postNewPassword = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const err = errors.array()[0]
			req.flash('error', err.msg)
			if (err.param === 'resetToken') {
				req.session.save(err => {
					if (err) console.log(err)
					return res.redirect('/reset')
				})
			} else {
				req.session.save(err => {
					if (err) console.log(err)
					return res.redirect('/reset/' + req.params.resetToken)
				})
			}
			return
		}

		const user = req.resetUser
		user.password = await bcrypt.hash(req.body.password, 12)
		user.resetToken = {}
		await user.save()
		res.redirect('/login')
	} catch (err) {
		console.log(err)
	}
}

//Signup
exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		active: req.url,
		pageTitle: 'Signup',
		errMsg: req.flash('error')
	})
}

exports.postSignup = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(422).render('auth/signup', {
				active: req.url,
				pageTitle: 'Signup',
				errMsg: errors.array()[0].msg,
				oldInput: {
					email: req.body.email,
					username: req.body.username
				}
			})
		}
		const hashedpw = await bcrypt.hash(req.body.password, 12)
		const user = new User({
			id: Date.now().toString(),
			username: req.body.username,
			password: hashedpw,
			email: req.body.email
		})

		await user.save()
		transporter.sendMail({
			to: user.email,
			from: 'abel@imageshop.com',
			subject: 'Signup Succeeded',
			html: '<h1>Successfully Signup!</h1>'
		})
		res.redirect('/login')
	} catch (err) {
		console.log(err)
	}
}

//Logout
exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) console.log(err)
		res.redirect('/')
	})
}
