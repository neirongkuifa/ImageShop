const express = require('express')
const path = require('path')
const ereact = require('express-react-views')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const https = require('https')

const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const authRouter = require('./routes/auth')
const errorController = require('./controllers/error')
const User = require('./models/user')
const isAuth = require('./middleware/is-auth')

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${
	process.env.MONGO_PW
}@image-shop-brnyc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`

const app = express()

//csrf initialization
const csrfProtection = csrf()

//Template Engine Settings
app.set('view engine', 'jsx')
app.set('views', path.join(__dirname, 'views'))
app.engine('jsx', ereact.createEngine())

//Session Store Setting
const store = new MongoDBStore({
	uri: MONGO_URI,
	databaseName: 'ImageShop',
	collection: 'sessions'
})

//Multer Config
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname)
	}
})

const filter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

//Morgan Config
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{ flags: 'a' }
)

//SSL Config
// const privateKey = fs.readFileSync('server.key')
// const certif = fs.readFileSync('server.cert')

//Middlewares
app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter: filter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: 'sessiontest',
		resave: false,
		saveUninitialized: false,
		store
	})
)

app.use(csrfProtection)

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn
	res.locals.csrf = req.csrfToken()
	next()
})

app.use(flash())

app.use(async (req, res, next) => {
	try {
		if (req.session.user) {
			const user = await User.findOne({ email: req.session.user })
			if (user) {
				req.user = user
			}
		}
		next()
	} catch (err) {
		throw new Error(err)
	}
})

app.use((req, res, next) => {
	req.isLoggedIn = req.session.isLoggedIn
	next()
})

//Routes
app.use('/admin', isAuth, adminRouter)
app.use('/', shopRouter)
app.use('/', authRouter)

app.get('/500', errorController.get500)

//Fallback Routes
app.use(errorController.get404)

app.use((err, req, res, next) => {
	console.log(err)
	res.status(500).render('500', {
		active: req.url,
		pageTitle: 'Error Occured'
	})
})

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true })
	.then(() => {
		console.log('Connected!')
		// https
		// 	.createServer({ key: privateKey, cert: certif }, app)
		app.listen(process.env.PORT || 3000)
	})
	.catch(err => {
		console.log(err)
	})
