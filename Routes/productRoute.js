import express from 'express'
import * as productController from '../Controllers/productController.js'
const router = express.Router()

router.get('/products',productController.getAllProduct)
router.post('/products',productController.postProduct)
router.get('/products/:id',productController.getProductById)
router.put('/products/:id',productController.putProduct)
router.delete('/products/:id',productController.deleteProduct)

export default router