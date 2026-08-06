import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js"
import Coupon from "../models/couponModel.js"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Shop from "../models/shopModel.js"


const getShop = async (req, res) => {

    const userId = req.user._id

    const shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found!")
    }

    res.status(200).json(shop)


}




const addShop = async (req, res) => {

    const { name, description, address, shopPhone } = req.body
    let user = req.user.id

    if (!name || !description || !address || !shopPhone) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    const shop = await Shop.create({ name, description, address, shopPhone, user })

    if (!shop) {
        res.status(401)
        throw new Error("Shop Not Created!")
    }

    res.status(201).json({
        message: "Request Has Been Sent To Admin",
        shop
    })


}

const updateShop = async (req, res) => {
    let shopId = req.params.sid

    // Shop owners can never change the approval status themselves
    delete req.body.status

    const shop = await Shop.findOne({ user: req.user._id })

    if (!shop || shop._id.toString() !== shopId) {
        res.status(403)
        throw new Error("You can only update your own shop!")
    }

    const updatedShop = await Shop.findByIdAndUpdate(shopId, req.body, { new: true })

    if (!updatedShop) {
        res.status(409)
        throw new Error("Shop Not Updated!")
    }

    res.status(200).json(updatedShop)
}


const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, shopId } = req.body;

        if (!name || !description || !price || !stock || !category) {
            return res.status(409).json({
                success: false,
                message: "Please Fill All Details!",
            });
        }

        // Product must belong to the seller's own shop
        const myShop = await Shop.findOne({ user: req.user._id })

        if (!myShop) {
            return res.status(404).json({
                success: false,
                message: "Shop Not Found! Please create a shop first.",
            });
        }

        if (shopId && shopId !== myShop._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only add products to your own shop!",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a product image",
            });
        }

        let uploadResponse;

        try {
            uploadResponse = await uploadToCloudinary(
                req.file.buffer,
                req.file.mimetype
            );
        } catch (cloudErr) {
            console.error("Cloudinary Upload Error:", cloudErr.message);

            return res.status(500).json({
                success: false,
                message: cloudErr.message,
                error: cloudErr,
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            productImage: uploadResponse.secure_url,
            shop: myShop._id,
        });

        await product.populate("shop");

        return res.status(201).json(product);
    } catch (err) {
        console.error("Add Product Error:", err.message);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


const updateProduct = async (req, res) => {

    const { name, description, price, stock, category } = req.body

    const myShop = await Shop.findOne({ user: req.user._id })

    const existing = await Product.findById(req.params.pid)

    if (!existing) {
        res.status(404)
        throw new Error('Product Not Found!')
    }

    if (!myShop || existing.shop.toString() !== myShop._id.toString()) {
        res.status(403)
        throw new Error('You can only update your own products!')
    }

    const updates = {}

    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (price !== undefined) updates.price = price
    if (stock !== undefined && stock !== "") updates.stock = stock
    if (category !== undefined) updates.category = category

    // Optional image replacement
    if (req.file) {
        const uploadResponse = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
        updates.productImage = uploadResponse.secure_url
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, updates, { new: true }).populate('shop')

    if (!updatedProduct) {
        res.status(409)
        throw new Error('Product Not Updated!')
    }

    res.status(200).json(updatedProduct)


}


const createCoupon = async (req, res) => {

    const userId = req.user._id

    const { couponCode, couponDiscount } = req.body

    if (!couponCode || !couponDiscount) {
        res.status(409)
        throw new Error("Please Enter All Fields!")
    }

    if (isNaN(couponDiscount) || couponDiscount <= 0 || couponDiscount > 100) {
        res.status(409)
        throw new Error("Discount must be between 1 and 100 percent!")
    }

    // Find My Shop
    const shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found! Please create a shop first.")
    }

    if (shop.status !== "accepted") {
        res.status(409)
        throw new Error("Your shop must be approved by admin before creating coupons!")
    }

    const couponExists = await Coupon.findOne({ couponCode: couponCode.toUpperCase() })

    if (couponExists) {
        res.status(409)
        throw new Error("Coupon With This Code Already Exists!")
    }

    const coupon = new Coupon({
        couponCode: couponCode.toUpperCase(),
        couponDiscount,
        shop: shop._id
    })

    await coupon.save()

    // await coupon.populate("shop")


    if (!coupon) {
        res.status(409)
        throw new Error("Coupon Not Created")
    }

    res.status(201).json(coupon)

}

const getMyShopOrders = async (req, res) => {

    let userId = req.user._id

    let shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found")
    }

    let myAllOrders = await Order.find({ shop: shop._id }).populate("user", "-password").populate("products.product").populate("coupon")

    if (!myAllOrders) {
        res.status(404)
        throw new Error("Orders Not Found!")
    }

    res.status(200).json(myAllOrders)

}



const updateOrder = async (req, res) => {

    let orderId = req.params.oid

    let userId = req.user._id

    let shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found")
    }

    let order = await Order.findById(orderId).populate("products.product")

    if (!order) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    if (order.shop.toString() !== shop._id.toString()) {
        res.status(403)
        throw new Error("This order does not belong to your shop!")
    }

    let { status } = req.body

    if (!status) {
        res.status(409)
        throw new Error("Status Not Found!")
    }

    const validStatuses = ["placed", "dispatched", "delivered", "cancelled"]

    if (!validStatuses.includes(status)) {
        res.status(400)
        throw new Error("Invalid order status")
    }

    if (status === order.status) {
        res.status(409)
        throw new Error(`Order is already ${status}`)
    }

    const populateQuery = [
        { path: "user", select: "-password" },
        { path: "products" },
        { path: "coupon" },
        { path: "shop" },
    ]

    // Stock is decremented at order placement (createOrder).
    // Cancel → restore stock exactly once.
    if (status === "cancelled") {
        for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.qty } })
        }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.oid,
        { status },
        { new: true }
    ).populate(populateQuery)

    if (!updatedOrder) {
        res.status(401)
        throw new Error("Order Not Updated")
    }

    res.status(200).json(updatedOrder)

}


const deleteProduct = async (req, res) => {
    const myShop = await Shop.findOne({ user: req.user._id })

    const product = await Product.findById(req.params.pid)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }

    if (!myShop || product.shop.toString() !== myShop._id.toString()) {
        res.status(403)
        throw new Error("You can only delete your own products!")
    }

    await Product.findByIdAndDelete(req.params.pid)

    res.status(200).json({ _id: req.params.pid, message: "Product deleted successfully" })
}


const shopOwnerController = { addProduct, addShop, updateOrder, updateProduct, updateShop, createCoupon, getMyShopOrders, getShop, deleteProduct }

export default shopOwnerController