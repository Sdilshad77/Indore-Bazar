import express from "express"
import protect from "../middleware/authMiddleware.js"
import cartController from "../controllers/cartController.js"


const router = express.Router()


router.get("/", protect.forAuthUsers, cartController.getCart)
router.post("/", protect.forAuthUsers, cartController.addToCart)
router.put("/update", protect.forAuthUsers, cartController.updateCart)
router.delete("/:productId", protect.forAuthUsers, cartController.removeCart)
router.post("/clear", protect.forAuthUsers, cartController.clearCart)


export default router