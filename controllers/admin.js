const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.findAll()
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
		const product = {
			id: Date.now().toString(),
			title: req.body.title,
			imgUrl: req.body.imgUrl,
			price: req.body.price,
			description: req.body.description
		}
		await Product.create(product)
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getEditProduct = async (req, res, next) => {
	try {
		const product = await Product.findByPk(req.params.productId)
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
		const product = await Product.findByPk(req.body.id)
		product.title = req.body.title
		product.price = req.body.price
		product.imgUrl = req.body.imgUrl
		product.description = req.body.description
		product.save()
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteProduct = async (req, res, next) => {
	await Product.destroy({
		where: {
			id: req.params.productId
		}
	})
	res.redirect('/admin/product-list')
}
