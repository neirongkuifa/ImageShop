const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Product = sequelize.define('product', {
	id: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false
	},
	imgUrl: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.TEXT,
		allowNull: false
	}
})

module.exports = Product

// const db = require('../util/database')

// module.exports = class Product {
// 	constructor(title, imgUrl, price, description) {
// 		this.id = Date.now().toString()
// 		this.title = title
// 		this.imgUrl = imgUrl
// 		this.description = description
// 		this.price = price
// 	}

// 	save() {
// 		return db.execute(
// 			`insert into products (id, title, imgUrl, price, description) values (?,?,?,?,?)`,
// 			[this.id, this.title, this.imgUrl, this.price, this.description]
// 		)
// 	}

// 	static fetchAll() {
// 		return db.execute('select * from products')
// 	}

// 	static fetchById(id) {
// 		return db.execute('select * from products where products.id=?', [id])
// 	}

// 	static updateProduct(product) {
// 		return db.execute()
// 	}

// 	static removeById(productId, cb) {
// 		getProductsFromFile(products => {
// 			const newProducts = products.filter(item => item.id !== productId)
// 			fs.writeFile(p, JSON.stringify(newProducts), err => {
// 				if (err) {
// 					console.log(err)
// 				} else {
// 					cb()
// 				}
// 			})
// 		})
// 	}
// }
