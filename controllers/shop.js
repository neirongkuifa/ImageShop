const Product = require('../models/product')
const getDB = require('../util/database').getDB
// const Order = require('../models/order')

exports.getProducts = async (req, res, next) => {
	try {
		// const products = await Product.findAll()
		const products = await Product.fetchAll()
		res.render('shop/product-list', { products, active: req.url })
	} catch (err) {
		console.log(err)
	}
}

exports.getIndex = async (req, res, next) => {
	try {
		// const products = await Product.findAll()
		const products = await Product.fetchAll()
		res.render('shop/index', { products, active: req.url, pageTitle: 'Shop' })
	} catch (err) {
		console.log(err)
	}
}

exports.getOrders = async (req, res, next) => {
	try {
		// const orders = await req.user.getOrders({ include: ['items'] })
		// const products = await orders.reduce(async (acc, cur) => {
		// 	const Acc = await acc
		// 	const items = await cur.getItems()
		// 	Acc[cur.id] = items
		// 	return Acc
		// }, {})
		const orders = await req.user.getOrders()
		res.render('shop/orders', {
			orders,
			active: req.url,
			pageTitle: 'Orders'
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getCart = async (req, res, next) => {
	try {
		const products = await req.user.getCart()
		res.render('shop/cart', {
			Products: products,
			active: req.url,
			pageTitle: 'Cart'
		})
	} catch (err) {
		console.log(err)
	}
}

exports.postCart = async (req, res, next) => {
	try {
		await req.user.addToCart(req.body.productId)
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteFromCart = async (req, res, next) => {
	try {
		// const cart = await req.user.getCart()
		// const product = await Product.findByPk(req.params.productId)
		// await cart.removeItem(product)
		await req.user.deleteFromCart(req.params.productId)
		res.redirect('/cart')
	} catch (err) {
		console.log(err)
	}
}

exports.placeOrder = async (req, res, next) => {
	try {
		// const order = await req.user.createOrder({ id: Date.now().toString() })
		// const cart = await req.user.getCart()
		// await cart.getItems().map(async item => {
		// 	await order.addItem(item, {
		// 		through: { id: Date.now().toString(), quantity: item.cartItem.quantity }
		// 	})
		// })
		// const items = await cart.getItems()
		// await cart.removeItems(items)
		req.user.addOrder()
		res.redirect('/orders')
	} catch (err) {
		console.log(err)
	}
}

// exports.getCheckout = async (req, res, next) => {
// 	try {
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

exports.getDetail = async (req, res, next) => {
	try {
		// const product = await Product.findByPk(req.params.productId)
		const product = await Product.fetchById(req.params.productId)
		res.render('shop/product-detail', {
			product: product,
			active: '/product-list',
			pageTitle: product.title
		})
	} catch (err) {
		console.log(err)
	}
}
