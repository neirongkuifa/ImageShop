const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'data', 'cart.json')

module.exports = class Cart {
	constructor() {
		this.products = {}
		this.totalPrice = 0
		if (fs.existsSync(p)) {
			try {
				const fileContent = fs.readFileSync(p)
				const cart = JSON.parse(fileContent)

				this.products = cart.products
				this.totalPrice = cart.totalPrice
			} catch (err) {
				console.log(err)
			}
		}
	}

	addToCart(product) {
		const id = product.id
		if (this.products[id]) {
			this.products[id] += 1
		} else {
			this.products[id] = 1
		}
		this.totalPrice += Number(product.price)
		fs.writeFile(p, JSON.stringify(this), err => {
			if (err) console.log(err)
		})
	}

	checkout() {}
}
