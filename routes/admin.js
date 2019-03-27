const express = require('express')
const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/product-list', adminController.getProducts)
router.get('/add-product', adminController.getAddProduct)
router.post('/add-product', adminController.postAddProduct)
router.get('/edit-product/:productId', adminController.getEditProduct)
router.post('/edit-product/', adminController.postEditProduct)
router.delete('/delete-product/:productId', adminController.deleteProduct)

module.exports = router
