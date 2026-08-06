import express from "express"
import productController from "../controllers/productController.js"

import reviewRoutes from "../routes/reviewRoutes.js"

const router = express.Router({ mergeParams: true })


router.get("/", productController.getProducts)
router.get("/search/:query", productController.searchProduct)
router.get("/:pid", productController.getProduct)

const addProductMiddleware = (req, res, next) => {
    // add to request object
    req.pid = req.params.pid
    next()
}


router.use("/:pid/review/", addProductMiddleware, reviewRoutes)


export default router