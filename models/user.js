// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const User = sequelize.define('user', {
// 	id: {
// 		type: Sequelize.STRING,
// 		primaryKey: true,
// 		allowNull: false
// 	},
// 	name: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},
// 	email: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},
// 	password: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	}
// })

const getDB = require('../util/database').getDB
const Product = require('./product')

class User {
	constructor(id, username, password, email, role, cart) {
		this.id = id ? id : Date.now().toString()
		this.username = username
		this.password = password
		this.email = email
		this.role = role
		this.cart = cart ? cart : { items: [] }
	}

	async save() {
		const db = getDB()
		try {
			await db.collection('users').insertOne(this)
		} catch (err) {
			console.log(err)
		}
	}

	static async fetchById(id) {
		const db = getDB()
		try {
			const user = await db.collection('users').findOne({ id })
			return user
		} catch (err) {
			console.log(err)
		}
	}

	async getCart() {
		try {
			const db = getDB()
			const productsList = this.cart.items.map(item => item.productId)
			const products = await db
				.collection('products')
				.find({ id: { $in: productsList } })
				.toArray()
			return products.map(product => {
				product.quantity = this.cart.items.find(
					item => item.productId === product.id
				).quantity
				return product
			})
		} catch (err) {
			console.log(err)
		}
	}

	async addToCart(id) {
		const db = getDB()
		try {
			const cartItems = [...this.cart.items]
			const index = cartItems.findIndex(item => item.productId === id)
			let updatedCart
			if (index > -1) {
				cartItems[index].quantity += 1
			} else {
				const product = await Product.fetchById(id)
				cartItems.push({ productId: product.id, quantity: 1 })
			}
			updatedCart = {
				items: cartItems
			}
			await db
				.collection('users')
				.updateOne({ id: this.id }, { $set: { cart: updatedCart } })
		} catch (err) {
			console.log(err)
		}
	}

	async deleteFromCart(id) {
		const db = getDB()
		try {
			const updatedCart = {
				items: this.cart.items.filter(item => item.productId !== id)
			}
			await db
				.collection('users')
				.updateOne({ id: this.id }, { $set: { cart: updatedCart } })
		} catch (err) {
			console.log(err)
		}
	}

	async addOrder() {
		try {
			const db = getDB()
			await db.collection('orders').insertOne({
				id: Date.now().toString(),
				userId: this.id,
				...this.cart
			})
			this.cart = { items: [] }
			await db
				.collection('users')
				.updateOne({ id: this.id }, { $set: { cart: this.cart } })
		} catch (err) {
			console.log(err)
		}
	}

	async getOrders() {
		try {
			const db = getDB()
			const orders = await db
				.collection('orders')
				.find({ userId: this.id })
				.toArray()
			const expandedOrders = await Promise.all(
				orders.map(async order => {
					const productList = order.items.map(item => item.productId)
					const products = await db
						.collection('products')
						.find({ id: { $in: productList } })
						.toArray()
					const expandedOrder = {
						id: order.id,
						items: products.map(product => {
							product.quantity = order.items.find(
								item => item.productId === product.id
							).quantity
							return product
						})
					}
					return expandedOrder
				})
			)
			return expandedOrders
		} catch (err) {
			console.log(err)
		}
	}
}

module.exports = User
