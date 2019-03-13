const express = require('express')
const path = require('path')
const ereact = require('express-react-views')
const mongoose = require('mongoose')

const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')
// const Product = require('./models/product')
// const User = require('./models/user')

const app = express()

//Template Engine Settings
app.set('view engine', 'jsx')
app.set('views', path.join(__dirname, 'views'))
app.engine('jsx', ereact.createEngine())

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(async (req, res, next) => {
	try {
		// const user = await db.collection('users').findOne({})
		// req.user = new User(
		// 	user.id,
		// 	user.username,
		// 	user.password,
		// 	user.email,
		// 	user.role,
		// 	user.cart
		// )
		next()
	} catch (err) {
		console.log(err)
	}
})

//Routes
app.use('/admin', adminRouter)
app.use('/', shopRoutes)

//Fallback Routes
app.use(errorController.getPageNotFound)

mongoose
	.connect(
		'mongodb+srv://ch48h2o:***REMOVED***@image-shop-brnyc.mongodb.net/test?retryWrites=true',
		{ useNewUrlParser: true }
	)
	.then(result => {
		console.log('Connected!')
		app.listen(3000)
	})
	.catch(err => {
		console.log(err)
	})

// mongoConnect(async () => {
// 	// const user = new User('Abel', '1234', 'test@test.com', 'Admin')
// 	// await user.save()
// 	app.listen(3000)
// 	console.log('Start Listening!')
// })
