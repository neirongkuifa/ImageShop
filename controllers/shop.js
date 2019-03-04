const Product = require('../models/product')
const cart = require('../models/cart')
const Cart = new cart()

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/product-list', { products, active: req.url })
	})
}

exports.getIndex = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/index', { products, active: req.url, pageTitle: 'Shop' })
	})
}
exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		orders: 'Orders Info',
		active: req.url,
		pageTitle: 'Orders'
	})
}
exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		Cart,
		active: req.url,
		pageTitle: 'Cart'
	})
}

exports.postCart = (req, res, next) => {
	const product = Product.fetchById(req.body.productId, product => {
		Cart.addToCart(product)
		res.redirect('/')
	})
}
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		order: 'Order Info',
		active: req.url,
		pageTitle: 'Checkout'
	})
}
exports.getDetail = (req, res, next) => {
	Product.fetchById(req.params.productId, product => {
		res.render('shop/product-detail', {
			product,
			active: '/product-list',
			pageTitle: product.title
		})
	})
}
