const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.findAll()
		res.render('shop/product-list', { products, active: req.url })
	} catch (err) {
		console.log(err)
	}
}

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.findAll()
		res.render('shop/index', { products, active: req.url, pageTitle: 'Shop' })
	} catch (err) {
		console.log(err)
	}
}

exports.getOrders = async (req, res, next) => {
	try {
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
		const cart = await req.user.getCart()
		const products = await cart.getItems()
		res.render('shop/cart', {
			Cart: cart,
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
		const product = await Product.findByPk(req.body.productId)
		const cart = await req.user.getCart()
		const prodsInCart = await cart.getItems({
			where: { id: req.body.productId }
		})
		if (prodsInCart.length < 1) {
			await cart.addItem(product, {
				through: { id: Date.now().toString(), quantity: 1 }
			})
		} else {
			await prodsInCart[0].cartItem.increment('quantity', { by: 1 })
		}
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteFromCart = async (req, res, next) => {
	try {
		const cart = await req.user.getCart()
		const product = await Product.findByPk(req.params.productId)
		await cart.removeItem(product)
		res.redirect('/cart')
	} catch (err) {
		console.log(err)
	}
}

exports.getCheckout = async (req, res, next) => {
	try {
		const order = await Order.create({ id: Date.now().toString() })
		req.user.addOrder(order)
		const cart = await req.user.getCart()
		await cart.getItems().map(async item => {
			await order.addItem(item, {
				through: { id: Date.now().toString(), quantity: item.cartItem.quantity }
			})
		})
		const items = await cart.getItems()
		await cart.removeItems(items)
		res.render('shop/checkout', {
			order,
			active: req.url,
			pageTitle: 'Checkout'
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getDetail = async (req, res, next) => {
	try {
		const product = await Product.findByPk(req.params.productId)
		res.render('shop/product-detail', {
			product: product,
			active: '/product-list',
			pageTitle: product.title
		})
	} catch (err) {
		console.log(err)
	}
}
