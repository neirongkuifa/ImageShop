const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callback => {
	MongoClient.connect(
		'mongodb+srv://ch48h2o:***REMOVED***@image-shop-brnyc.mongodb.net/test?retryWrites=true',
		{ useNewUrlParser: true }
	)
		.then(client => {
			console.log('Connected!')
			_db = client.db('Image-Shop')
			callback()
		})
		.catch(err => {
			console.log(err)
			throw err
		})
}

const getDB = () => {
	if (_db) {
		return _db
	}
	throw 'No Database Found'
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB

// const Sequelize = require('sequelize')

// const Op = Sequelize.Op
// const operatorsAliases = {
// 	$eq: Op.eq,
// 	$ne: Op.ne,
// 	$gte: Op.gte,
// 	$gt: Op.gt,
// 	$lte: Op.lte,
// 	$lt: Op.lt,
// 	$not: Op.not,
// 	$in: Op.in,
// 	$notIn: Op.notIn,
// 	$is: Op.is,
// 	$like: Op.like,
// 	$notLike: Op.notLike,
// 	$iLike: Op.iLike,
// 	$notILike: Op.notILike,
// 	$regexp: Op.regexp,
// 	$notRegexp: Op.notRegexp,
// 	$iRegexp: Op.iRegexp,
// 	$notIRegexp: Op.notIRegexp,
// 	$between: Op.between,
// 	$notBetween: Op.notBetween,
// 	$overlap: Op.overlap,
// 	$contains: Op.contains,
// 	$contained: Op.contained,
// 	$adjacent: Op.adjacent,
// 	$strictLeft: Op.strictLeft,
// 	$strictRight: Op.strictRight,
// 	$noExtendRight: Op.noExtendRight,
// 	$noExtendLeft: Op.noExtendLeft,
// 	$and: Op.and,
// 	$or: Op.or,
// 	$any: Op.any,
// 	$all: Op.all,
// 	$values: Op.values,
// 	$col: Op.col
// }

// const sequelize = new Sequelize('photo_store', 'root', '1234qwer', {
// 	dialect: 'mysql',
// 	host: 'localhost',
// 	operatorsAliases
// })

// module.exports = sequelize
