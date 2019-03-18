const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		active: req.url,
		pageTitle: 'Login',
		isLoggedIn: req.isLoggedIn
	})
}

exports.postLogin = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.id })
		if (user) {
			const authPass = await bcrypt.compare(req.body.password, user.password)
			if (authPass) {
				req.session.isLoggedIn = true
				req.session.user = req.body.id
				await req.session.save(err => {
					if (err) console.log(err)
				})
				return res.redirect('/')
			}
		}
		res.redirect('/login')
	} catch (err) {
		console.log(err)
	}
}

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		active: req.url,
		pageTitle: 'Signup',
		isLoggedIn: req.isLoggedIn
	})
}

exports.postSignup = async (req, res, next) => {
	try {
		const exist = await User.findOne({ email: req.body.email })
		if (!exist) {
			const hashedpw = await bcrypt.hash(req.body.password, 12)
			const user = new User({
				id: Date.now().toString(),
				username: req.body.username,
				password: hashedpw,
				email: req.body.email
			})

			await user.save()
			res.redirect('/login')
		} else {
			res.redirect('/signup')
		}
	} catch (err) {
		console.log(err)
	}
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) console.log(err)
		res.redirect('/')
	})
}
