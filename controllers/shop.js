const Product = require('../models/product')
const cart = require('../models/cart')
const Cart = new cart()

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
exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		orders: 'Orders Info',
		active: req.url,
		pageTitle: 'Orders'
	})
}
exports.getCart = (req, res, next) => {
	Cart.getAllInCart(products => {
		Product.fetchAll(products => {
			let C = []
			for (let product of products) {
				const item = Cart.products[product.id]
				if (item) {
					C.push({ product, qty: item.qty })
				}
			}
			res.render('shop/cart', {
				Cart: C,
				Products: products,
				active: req.url,
				pageTitle: 'Cart'
			})
		})
	})
}
exports.postCart = async (req, res, next) => {
	try {
		const product = await Product.findByPk(req.body.productId)
		Cart.addToCart(product)
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}
exports.getDeleteFromCart = (req, res, next) => {
	Cart.deleteFromCart(req.params.productId, () => {
		res.redirect('/cart')
	})
}
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		order: 'Order Info',
		active: req.url,
		pageTitle: 'Checkout'
	})
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
