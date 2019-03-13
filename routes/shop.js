const express = require('express')
// const shopController = require('../controllers/shop')

const router = express.Router()

router.get('/', shopController.getIndex)
// router.get('/cart', shopController.getCart)
// router.post('/cart', shopController.postCart)
// router.get('/checkout/', shopController.getCheckout)
// router.get('/product-list/:productId', shopController.getDetail)
// router.get('/delete-from-cart/:productId', shopController.getDeleteFromCart)
// router.get('/product-list', shopController.getProducts)
// router.get('/orders', shopController.getOrders)
// router.get('/place-order', shopController.placeOrder)

module.exports = router
