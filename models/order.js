const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Order = sequelize.define('order', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false
	},
	address: {
		type: Sequelize.STRING,
		allowNull: true
	},
	paymentStatus: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false
	}
})

module.exports = Order
