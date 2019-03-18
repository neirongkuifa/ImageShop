const express = require('express')
const path = require('path')
const ereact = require('express-react-views')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)

const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const authRouter = require('./routes/auth')
const errorController = require('./controllers/error')
const User = require('./models/user')
const isAuth = require('./middleware/is-auth')

const app = express()

//csrf initialization
const csrfProtection = csrf()

//Template Engine Settings
app.set('view engine', 'jsx')
app.set('views', path.join(__dirname, 'views'))
app.engine('jsx', ereact.createEngine())

//Session Store Setting
const store = new MongoDBStore({
	uri:
		'mongodb+srv://ch48h2o:***REMOVED***@image-shop-brnyc.mongodb.net/ImageShop?retryWrites=true',
	databaseName: 'ImageShop',
	collection: 'sessions'
})

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: 'sessiontest',
		resave: false,
		saveUninitialized: false,
		store
	})
)

app.use(csrfProtection)

app.use(flash())

app.use(async (req, res, next) => {
	try {
		if (req.session.user)
			req.user = await User.findOne({ email: req.session.user })
		next()
	} catch (err) {
		console.log(err)
	}
})

app.use((req, res, next) => {
	req.isLoggedIn = req.session.isLoggedIn
	next()
})

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn
	res.locals.csrf = req.csrfToken()
	next()
})

//Routes
app.use('/admin', isAuth, adminRouter)
app.use('/', shopRouter)
app.use('/', authRouter)

//Fallback Routes
app.use(errorController.getPageNotFound)

mongoose
	.connect(
		'mongodb+srv://ch48h2o:***REMOVED***@image-shop-brnyc.mongodb.net/ImageShop?retryWrites=true',
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log('Connected!')
		app.listen(3000)
	})
	.catch(err => {
		console.log(err)
	})
