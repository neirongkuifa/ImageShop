const express = require('express')
const path = require('path')
const ereact = require('express-react-views')

const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Order = require('./models/order')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

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
		req.user = await User.findByPk('1552175736780')
		req.order = await Order.findByPk('1552175736795')
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

User.hasMany(Product)
User.hasMany(Order)
Order.hasOne(Cart)
Cart.belongsToMany(Product, { as: 'items', through: CartItem })
Product.belongsToMany(Cart, { as: 'buyers', through: CartItem })

sequelize
	.sync()
	.then(() => {
		process()
	})
	.then(() => {
		app.listen(3000)
	})
	.catch(err => {
		console.log(err)
	})

const process = async () => {
	try {
		const users = await User.findAll()
		let user
		if (users.length < 1) {
			user = await User.create({
				id: Date.now().toString(),
				name: 'test',
				email: 'test@test.com',
				password: '1234'
			})
			const order = await Order.create({ id: Date.now().toString() })
			await user.addOrder(order)
			const cart = await Cart.create({ id: Date.now().toString() })
			await order.setCart(cart)
		} else {
			user = users[0]
		}
	} catch (err) {
		console.log(err)
	}
}
