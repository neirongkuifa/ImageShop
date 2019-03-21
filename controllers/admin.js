const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find({ userId: req.user.id })
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
		const product = new Product({
			id: Date.now().toString(),
			title: req.body.title,
			price: req.body.price,
			imgUrl: req.body.imgUrl,
			description: req.body.description,
			userId: req.user.id
		})
		await product.save()
		res.redirect('/admin/add-product')
	} catch (err) {
		console.log(err)
	}
}

exports.getEditProduct = async (req, res, next) => {
	try {
		const product = await Product.findOne({
			id: req.params.productId,
			userId: req.user.id
		})
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
		const update = {
			title: req.body.title,
			price: req.body.price,
			imgUrl: req.body.imgUrl,
			description: req.body.description
		}
		await Product.updateOne(
			{ id: req.body.id, userId: req.user.id },
			update,
			err => {
				if (err) console.log(err)
			}
		)
		res.redirect('/')
	} catch (err) {
		console.log(err)
	}
}

exports.getDeleteProduct = async (req, res, next) => {
	await Product.deleteOne(
		{ id: req.params.productId, userId: req.user.id },
		err => {
			if (err) console.log(err)
		}
	)
	res.redirect('/admin/product-list')
}
