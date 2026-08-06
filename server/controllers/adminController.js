import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Shop from "../models/shopModel.js"
import User from "../models/userModel.js"

const getUsers = async (req, res) => {
    const users = await User.find().select("-password")

    if (!users) {
        res.status(404)
        throw new Error('Users Not Found!')
    } else {
        res.status(200).json(users)
    }
}

const getAllOrders = async (req, res) => {
    const allOrders = await Order.find().populate("user", "-password").populate("products.product").populate("coupon").populate('shop')


    if (!allOrders) {
        res.status(404)
        throw new Error("Orders Not Found!")
    }

    res.status(200).json(allOrders)

}

const updateUser = async (req, res) => {

    if (typeof req.body.isActive !== "boolean") {
        res.status(409)
        throw new Error('Please Send Status Of User')
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.uid, { isActive: req.body.isActive }, { new: true, select: "-password" })

    if (!updatedUser) {
        res.status(409)
        throw new Error('UserNot Updated')
    }

    res.status(200).json(updatedUser)

}

const getAllShops = async (req, res) => {

    const shops = await Shop.find().populate("user", "-password")

    if (!shops) {
        res.status(404)
        throw new Error('Shops Not Found')
    }


    res.status(200).json(shops)

}


const updateShop = async (req, res) => {

    const { status } = req.body
    const validStatuses = ["pending", "accepted", "rejected"]

    if (!status || !validStatuses.includes(status)) {
        res.status(409)
        throw new Error('Please Send A Valid Status!')
    }

    let shopId = req.params.sid

    const updatedShop = await Shop.findByIdAndUpdate(shopId, { status }, { new: true })

    if (!updatedShop) {
        res.status(409)
        throw new Error('Shop Cannot Be Activated!')
    }

    // Update The User — seller flag only when shop is accepted
    await User.findByIdAndUpdate(updatedShop.user, { isShopOwner: status === "accepted" }, { new: true })

    res.status(200).json(updatedShop)


}





const updateOrder = async (req, res) => {
    const { status } = req.body
    const validStatuses = ["placed", "delivered", "dispatched", "cancelled"]

    if (!status || !validStatuses.includes(status)) {
        res.status(400)
        throw new Error('Invalid order status')
    }

    const currentOrder = await Order.findById(req.params.oid)

    if (!currentOrder) {
        res.status(404)
        throw new Error('Order not found')
    }

    // Prevent illegal transitions & double stock adjustments
    if (currentOrder.status === status) {
        res.status(409)
        throw new Error('Order is already in this status')
    }

    // Cancel → restore stock (only once)
    if (status === "cancelled" && currentOrder.status !== "cancelled") {
        for (const item of currentOrder.products) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } })
        }
    }

    // Dispatch → decrement stock (never restores on later statuses)
    if (status === "dispatched" && currentOrder.status === "placed") {
        for (const item of currentOrder.products) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } })
        }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.oid,
        { status },
        { new: true }
    ).populate("user", "-password").populate("products.product").populate("coupon").populate('shop')

    res.status(200).json(updatedOrder)
}




const adminControllers = { getUsers, getAllOrders, updateShop, updateUser, getAllShops, updateOrder }


export default adminControllers