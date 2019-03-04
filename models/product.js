const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'data', 'products.json')

const getProductsFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (!err) {
			return cb(JSON.parse(fileContent))
		}
		return cb([])
	})
}

module.exports = class Product {
	constructor(title, imgUrl, price, description) {
		this.id = Date.now().toString()
		this.title = title
		this.imgUrl = imgUrl
		this.description = description
		this.price = price
	}

	save() {
		getProductsFromFile(products => {
			products.push(this)
			fs.writeFile(p, JSON.stringify(products), err => {
				if (err) {
					console.log(err)
				}
			})
		})
	}

	static fetchAll(cb) {
		getProductsFromFile(cb)
	}

	static fetchById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(item => item.id === id)
			cb(product)
		})
	}

	static replaceProduct(product, cb) {
		getProductsFromFile(products => {
			products.forEach(item => {
				if (item.id === product.id) {
					item.title = product.title
					item.imgUrl = product.imgUrl
					item.description = product.description
					item.price = product.price
				}
			})
			fs.writeFile(p, JSON.stringify(products), err => {
				if (err) {
					console.log(err)
				} else {
					cb()
				}
			})
		})
	}

	static removeById(productId, cb) {
		getProductsFromFile(products => {
			const newProducts = products.filter(item => item.id !== productId)
			fs.writeFile(p, JSON.stringify(newProducts), err => {
				if (err) {
					console.log(err)
				} else {
					cb()
				}
			})
		})
	}
}
