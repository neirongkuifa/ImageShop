const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const OrderItem = sequelize.define('orderItem', {
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

module.exports = OrderItem
