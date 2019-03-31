const fs = require('fs')
const path = require('path')
const PDFDoc = require('pdfkit')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const Product = require('../models/product')
const Order = require('../models/order')

const ITEMS_PER_PAGE = 2

exports.getDetail = async (req, res, next) => {
	try {
		const product = await Product.findOne({ id: req.params.productId })
		res.render('shop/product-detail', {
			product: product,
			active: '/product-list',
			pageTitle: product.title
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const count = await Product.find().countDocuments()
		let page = 1
		if (req.query.page) {
			page = parseInt(req.query.page)
		}
		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE)
		res.render('shop/product-list', {
			products,
			active: '/product-list',
			path: '/product-list',
			pageTitle: 'Shop',
			currentPage: page,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(count / ITEMS_PER_PAGE)
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getIndex = async (req, res, next) => {
	try {
		const count = await Product.find().countDocuments()
		let page = 1
		if (req.query.page) {
			page = parseInt(req.query.page)
		}
		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE)
		res.render('shop/index', {
			products,
			active: '/',
			pageTitle: 'Shop',
			path: '',
			currentPage: page,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(count / ITEMS_PER_PAGE)
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
			active: '/cart',
			pageTitle: 'Cart'
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
			active: '/orders',
			pageTitle: 'Orders'
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getInvoice = async (req, res, next) => {
	try {
		const orderId = req.params.orderId
		const order = await Order.findOne({ id: orderId, userId: req.user.id })
		if (!order) {
			return res.redirect('/orders')
		}
		const expandedOrder = await Promise.all(
			order.items.map(async item => {
				const product = await Product.findOne({ id: item.productId })
				product.quantity = item.quantity
				return product
			})
		)

		const orderPath = path.join(
			__dirname,
			'..',
			'data',
			'invoice',
			orderId + '.pdf'
		)
		const pdf = new PDFDoc()
		res.setHeader('Content-Type', 'application/pdf')
		res.setHeader('Content-Disposition', 'inline;filename="invoice"')
		pdf.pipe(fs.createWriteStream(orderPath))
		pdf.pipe(res)
		pdf.fontSize(26).text('Invoice', { align: 'center' })
		pdf
			.fontSize(15)
			.text(
				'--------------------------------------------------------------------------------'
			)
		let total = 0
		expandedOrder.map(item => {
			total += item.quantity * item.price
			pdf
				.fontSize(15)
				.text(
					'#' +
						item.id +
						'  ' +
						item.title +
						'                         ' +
						item.quantity +
						'*' +
						item.price
				)
		})
		pdf
			.fontSize(15)
			.text(
				'--------------------------------------------------------------------------------'
			)
		pdf.fontSize(20).text('Total Price: $' + total)
		pdf.end()
	} catch (err) {
		console.log('Here')
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.getCheckout = async (req, res, next) => {
	try {
		const order = await Order.findOne({
			id: req.params.orderId,
			userId: req.user.id
		})

		if (!order) {
			return res.redirect('/orders')
		}
		const expandedOrder = await Promise.all(
			order.items.map(async item => {
				const product = await Product.findOne({ id: item.productId })
				product.quantity = item.quantity
				return product
			})
		)
		res.render('shop/checkout', {
			Products: expandedOrder,
			active: '/orders',
			pageTitle: 'Checkout',
			orderId: req.params.orderId
		})
	} catch (err) {
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.postCheckout = async (req, res, next) => {
	try {
		const token = req.body.stripeToken
		const orderId = req.body.orderId
		const order = await Order.findOne({ id: orderId, userId: req.user.id })
		if (!order) {
			return redirect('/500')
		}
		let total = 0
		const expandedOrder = await Promise.all(
			order.items.map(async item => {
				const product = await Product.findOne({ id: item.productId })
				product.quantity = item.quantity
				total += product.price * product.quantity
				return product
			})
		)

		const charge = await stripe.charges.create({
			amount: total * 100,
			currency: 'usd',
			description: 'Example Charge',
			source: token,
			metadata: { order_id: orderId }
		})
		if (charge.paid === true) {
			await Order.updateOne(
				{ id: orderId, userId: req.user.id },
				{ paymentStatus: true },
				err => {
					if (err) {
						console.log(err)
					}
				}
			)
			res.redirect('/orders')
		}
	} catch (err) {
		console.log(err)
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}
