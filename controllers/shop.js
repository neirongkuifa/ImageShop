const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find()
		res.render('shop/product-list', {
			products,
			active: req.url,
			isLoggedIn: req.isLoggedIn
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.find()
		res.render('shop/index', {
			products,
			active: req.url,
			pageTitle: 'Shop',
			isLoggedIn: req.isLoggedIn
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getCart = async (req, res, next) => {
	try {
		const cart = await req.user.cart.items
		const products = await Promise.all(
			cart.map(async item => {
				const product = await Product.findOne({ id: item.productId })
				return {
					id: product.id,
					title: product.title,
					price: product.price,
					imgUrl: product.imgUrl,
					description: product.description,
					quantity: item.quantity
				}
			})
		)
		res.render('shop/cart', {
			Products: products,
			active: req.url,
			pageTitle: 'Cart',
			isLoggedIn: req.isLoggedIn
		})
	} catch (err) {
		console.log(err)
	}
}

exports.postCart = async (req, res, next) => {
	try {
		const index = req.user.cart.items.findIndex(
			item => item.productId === req.body.productId
		)
		if (index < 0) {
			req.user.cart.items.push({ productId: req.body.productId, quantity: 1 })
		} else {
			req.user.cart.items[index].quantity += 1
		}
		req.user.save()
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteFromCart = async (req, res, next) => {
	try {
		const newCart = req.user.cart.items.filter(
			item => item.productId !== req.params.productId
		)
		req.user.cart.items = newCart
		req.user.save()
		res.redirect('/cart')
	} catch (err) {
		console.log(err)
	}
}

exports.placeOrder = async (req, res, next) => {
	try {
		const order = new Order({
			id: Date.now().toString(),
			userId: req.user.id,
			items: req.user.cart.items
		})
		order.save()
		req.user.cart.items = []
		req.user.save()
		res.redirect('/orders')
	} catch (err) {
		console.log(err)
	}
}

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({ userId: req.user.id })
		const expandedOrders = await Promise.all(
			orders.map(async order => {
				const expandedOrder = await Promise.all(
					order.items.map(async item => {
						const product = await Product.findOne({ id: item.productId })
						product.quantity = item.quantity
						return product
					})
				)
				return {
					id: order.id,
					userId: order.userId,
					items: expandedOrder,
					paymentStatus: order.paymentStatus
				}
			})
		)
		res.render('shop/orders', {
			orders: expandedOrders,
			active: req.url,
			pageTitle: 'Orders',
			isLoggedIn: req.isLoggedIn
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getDetail = async (req, res, next) => {
	try {
		const product = await Product.findOne({ id: req.params.productId })
		res.render('shop/product-detail', {
			product: product,
			active: '/product-list',
			pageTitle: product.title,
			isLoggedIn: req.isLoggedIn
		})
	} catch (err) {
		console.log(err)
	}
}
