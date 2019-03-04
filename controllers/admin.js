const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/product-list', {
			products,
			active: '/admin' + req.url,
			pageTitle: 'Admin Product List'
		})
	})
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		active: '/admin' + req.url,
		pageTitle: 'Add Product'
	})
}

exports.postAddProduct = (req, res, next) => {
	const product = new Product(
		req.body.title,
		req.body.imgUrl,
		req.body.price,
		req.body.description
	)
	product.save()
	res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
	Product.fetchById(req.params.productId, product => {
		res.render('admin/edit-product', {
			active: '/admin' + req.url,
			pageTitle: 'Edit Product',
			product
		})
	})
}

exports.postEditProduct = (req, res, next) => {
	let product = new Product(
		req.body.title,
		req.body.imgUrl,
		req.body.price,
		req.body.description
	)
	product['id'] = req.body.id
	console.log(product)
	Product.replaceProduct(product, () => {
		res.redirect('/')
	})
}

exports.getDeleteProduct = (req, res, next) => {
	Product.removeById(req.params.productId, () => {
		res.redirect('/')
	})
}
