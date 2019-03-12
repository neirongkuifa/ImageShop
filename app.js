const express = require('express')
const path = require('path')
const ereact = require('express-react-views')

const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')
// const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-item')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
const mongoConnect = require('./util/database').mongoConnect
const getDB = require('./util/database').getDB

const app = express()

//Template Engine Settings
app.set('view engine', 'jsx')
app.set('views', path.join(__dirname, 'views'))
app.engine('jsx', ereact.createEngine())

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(async (req, res, next) => {
	const db = getDB()
	try {
		const user = await db.collection('users').findOne({})
		req.user = new User(
			user.id,
			user.username,
			user.password,
			user.email,
			user.role,
			user.cart
		)
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

mongoConnect(async () => {
	// const user = new User('Abel', '1234', 'test@test.com', 'Admin')
	// await user.save()
	app.listen(3000)
	console.log('Start Listening!')
})

// User.hasMany(Product)

// //Create when user create
// User.hasOne(Cart)
// Cart.belongsToMany(Product, { as: 'items', through: CartItem })
// Product.belongsToMany(Cart, { as: 'buyers', through: CartItem })

// //Create when checkout
// User.hasMany(Order)
// Order.belongsToMany(Product, { as: 'items', through: OrderItem })
// Product.belongsToMany(Order, { as: 'orders', through: OrderItem })

// sequelize
// 	.sync()
// 	.then(() => {
// 		process()
// 	})
// 	.then(() => {
// 		app.listen(3000)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})

// const process = async () => {
// 	try {
// 		const users = await User.findAll()
// 		let user
// 		if (users.length < 1) {
// 			user = await User.create({
// 				id: Date.now().toString(),
// 				name: 'test',
// 				email: 'test@test.com',
// 				password: '1234'
// 			})
// 			const cart = await Cart.create({ id: Date.now().toString() })
// 			await user.setCart(cart)
// 		} else {
// 			user = users[0]
// 		}
// 	} catch (err) {
// 		console.log(err)
// 	}
// }