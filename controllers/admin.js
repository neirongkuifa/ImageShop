const Product = require('../models/product')
const fileHandler = require('../util/file')
const path = require('path')

const ITEMS_PER_PAGE = 2

exports.getProducts = async (req, res, next) => {
	try {
		const count = await Product.find({ userId: req.user.id }).countDocuments()
		let page = 1
		if (req.query.page) {
			page = parseInt(req.query.page)
		}
		const products = await Product.find({ userId: req.user.id })
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE)
		res.render('admin/product-list', {
			products,
			active: '/admin/product-list',
			pageTitle: 'Admin Product List',
			path: '/admin/product-list',
			currentPage: page,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(count / ITEMS_PER_PAGE)
		})
	} catch (err) {
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		active: '/admin/add-product',
		pageTitle: 'Add Product'
	})
}

exports.postAddProduct = async (req, res, next) => {
	try {
		const image = req.file
		if (!image) {
			return res.render('admin/add-product', {
				active: '/admin/add-product',
				pageTitle: 'Add Product',
				errMsg: 'Invalid Image File'
			})
		}
		const product = new Product({
			id: Date.now().toString(),
			title: req.body.title,
			price: req.body.price,
			imgUrl: '/' + image.path,
			description: req.body.description,
			userId: req.user.id
		})
		await product.save()
		res.redirect('/admin/add-product')
	} catch (err) {
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.getEditProduct = async (req, res, next) => {
	try {
		const product = await Product.findOne({
			id: req.params.productId,
			userId: req.user.id
		})
		res.render('admin/edit-product', {
			active: '/admin/edit-product',
			pageTitle: 'Edit Product',
			product
		})
	} catch (err) {
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.postEditProduct = async (req, res, next) => {
	try {
		const update = {
			title: req.body.title,
			price: req.body.price,
			description: req.body.description
		}
		const image = req.file
		if (image) {
			update.imgUrl = '/' + image.path
			const product = await Product.findOne({
				id: req.body.id,
				userId: req.user.id
			})
			const filePath = path.join(__dirname, '..', product.imgUrl)
			fileHandler.deleteFile(filePath)
		}
		await Product.updateOne(
			{ id: req.body.id, userId: req.user.id },
			update,
			err => {
				if (err) {
					const error = new Error(err)
					error.httpStatusCode = 500
					return next(error)
				}
			}
		)
		res.redirect('/')
	} catch (err) {
		const error = new Error(err)
		error.httpStatusCode = 500
		return next(error)
	}
}

exports.deleteProduct = async (req, res, next) => {
	const product = await Product.findOne({
		id: req.params.productId,
		userId: req.user.id
	})
	if (!product) {
		return res.status(500).json({ message: 'Failed' })
	}
	const filePath = path.join(__dirname, '..', product.imgUrl)
	fileHandler.deleteFile(filePath)
	await Product.deleteOne(
		{ id: req.params.productId, userId: req.user.id },
		err => {
			if (err) {
				return res.status(500).json({ message: 'Failed' })
			}
		}
	)
	res.status(200).json({ message: 'Success' })
}
