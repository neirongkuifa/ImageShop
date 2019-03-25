const mongoose = require('mongoose')

//Order Model

const Schema = mongoose.Schema

const orderSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
		ref: 'User'
	},
	items: [
		{
			productId: {
				type: String,
				required: true,
				ref: 'Product'
			},
			quantity: {
				type: Number,
				required: true
			}
		}
	],
	paymentStatus: {
		type: Boolean,
		required: true,
		default: false
	}
})

module.exports = mongoose.model('Order', orderSchema)
