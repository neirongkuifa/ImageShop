const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
	try {
		// const products = await req.user.getProducts()
		const products = await Product.fetchAll()
		res.render('admin/product-list', {
			products,
			active: '/admin' + req.url,
			pageTitle: 'Admin Product List'
		})
	} catch (err) {
		console.log(err)
	}
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		active: '/admin' + req.url,
		pageTitle: 'Add Product'
	})
}

exports.postAddProduct = async (req, res, next) => {
	try {
		// const product = await Product.create({
		// 	id: Date.now().toString(),
		// 	title: req.body.title,
		// 	imgUrl: req.body.imgUrl,
		// 	price: req.body.price,
		// 	description: req.body.description
		// })
		// await req.user.addProduct(product)
		const product = new Product(
			Date.now().toString(),
			req.body.title,
			req.body.price,
			req.body.imgUrl,
			req.body.description,
			req.user.id
		)
		await product.save()
		res.redirect('/admin/add-product')
	} catch (err) {
		console.log(err)
	}
}

exports.getEditProduct = async (req, res, next) => {
	try {
		// const product = await Product.findByPk(req.params.productId)
		const product = await Product.fetchById(req.params.productId)
		res.render('admin/edit-product', {
			active: '/admin' + req.url,
			pageTitle: 'Edit Product',
			product
		})
	} catch (err) {
		console.log(err)
	}
}

exports.postEditProduct = async (req, res, next) => {
	try {
		// const product = await Product.findByPk(req.body.id)
		// product.title = req.body.title
		// product.price = req.body.price
		// product.imgUrl = req.body.imgUrl
		// product.description = req.body.description
		// product.save()
		const update = {
			title: req.body.title,
			price: req.body.price,
			imgUrl: req.body.imgUrl,
			description: req.body.description
		}
		Product.updateById(req.body.id, update)
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteProduct = async (req, res, next) => {
	await Product.deleteById(req.params.productId)
	res.redirect('/admin/product-list')
}
