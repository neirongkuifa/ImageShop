const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	imgUrl: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
		ref: 'User'
	}
})

module.exports = mongoose.model('Product', productSchema)
