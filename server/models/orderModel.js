import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
                default: 1
            },
            purchasedPrice: {
                type: Number,
                required: true,
            },
            _id: false
        }
    ],
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "delivered", "dispatched", "cancelled"],
        required: true
    },
    isDiscounted: {
        type: Boolean,
        required: true,
        default: false
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 0
    },
    totalBillAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "upi", "card"],
        required: true,
        default: "cod"
    }
}, {
    timestamps: true
})


const Order = mongoose.model("Order", orderSchema)

export default Order