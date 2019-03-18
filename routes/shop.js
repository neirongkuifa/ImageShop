const express = require('express')
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', shopController.getIndex)
router.get('/cart', isAuth, shopController.getCart)
router.post('/cart', isAuth, shopController.postCart)
// router.get('/checkout/', shopController.getCheckout)
router.get('/product-list/:productId', shopController.getDetail)
router.get(
	'/delete-from-cart/:productId',
	isAuth,
	shopController.getDeleteFromCart
)
router.get('/product-list', shopController.getProducts)
router.get('/orders', isAuth, shopController.getOrders)
router.get('/place-order', isAuth, shopController.placeOrder)

module.exports = router
