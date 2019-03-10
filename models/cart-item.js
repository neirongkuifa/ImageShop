const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const CartItem = sequelize.define('cartItem', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false
	},
	quantity: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
})

module.exports = CartItem
