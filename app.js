const express = require('express')
const path = require('path')
const ereact = require('express-react-views')

const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')
const sequelize = require('./util/database')

const app = express()

//Template Engine Settings
app.set('view engine', 'jsx')
app.set('views', path.join(__dirname, 'views'))
app.engine('jsx', ereact.createEngine())

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/admin', adminRouter)
app.use('/', shopRoutes)

//Fallback Routes
app.use(errorController.getPageNotFound)

sequelize
	.sync()
	.then(result => {
		app.listen(3000)
	})
	.catch(err => {
		console.log(err)
	})
