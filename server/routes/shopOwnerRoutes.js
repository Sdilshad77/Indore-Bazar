import express from "express"
import shopOwnerController from "../controllers/shopOwnerControllers.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/fileUploadMiddleware.js"


const router = express.Router()

// Get Shop
router.get("/", protect.forAuthUsers, shopOwnerController.getShop)

// Create Shop
router.post("/create-shop", protect.forAuthUsers, shopOwnerController.addShop)

// Add Product
router.post("/add-product", protect.forAuthUsers, upload.single('productImage'), shopOwnerController.addProduct)

// Shop Orders
router.get("/order/", protect.forAuthUsers, shopOwnerController.getMyShopOrders)

// Update Order
router.put("/order/:oid", protect.forAuthUsers, shopOwnerController.updateOrder)

// Update Product
router.put("/product/:pid", protect.forAuthUsers, upload.single('productImage'), shopOwnerController.updateProduct)

// Delete Product
router.delete("/product/:pid", protect.forAuthUsers, shopOwnerController.deleteProduct)

// Update Shop
router.put("/shop/:sid", protect.forAuthUsers, shopOwnerController.updateShop)

// Create Coupon
router.post("/coupon", protect.forAuthUsers, shopOwnerController.createCoupon)

export default router