import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
}, {
    timestamps: true
})

productSchema.index({ name: 1 })
productSchema.index({ category: 1 })
productSchema.index({ shop: 1 })

const Product = mongoose.model("Product", productSchema)

export default Product