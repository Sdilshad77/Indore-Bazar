import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

const getCart = async (req, res) => {

    const userId = req.user._id

    const cart = await Cart.findOne({ user: userId }).populate({ path: 'products.product', populate: { path: 'shop', select: '_id name' } })

    if (!cart) {
        res.status(200).json({
            products: []
        })
        return
    }

    res.status(200).json(cart)



}
const addToCart = async (req, res) => {

    const { productId, qty = 1 } = req.body
    const userId = req.user._id

    // Validate product exists
    const product = await Product.findById(productId)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }

    // Check id product in stock
    if (product.stock < qty) {
        res.status(400)
        throw new Error("Insufficient Stock")
    }

    // Find Users Cart
    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
        // Create new cart if does not exist
        cart = new Cart({
            user: userId,
            products: [{ product: productId, qty }]
        })
    } else {
        // Check if product is already in cart
        const productIndex = cart.products.findIndex((item) => {
            return item.product.toString() === productId
        })

        if (productIndex > -1) {
            // Update Quantity if product exists
            cart.products[productIndex].qty += parseInt(qty)

            // Check total quantity against stock
            if (cart.products[productIndex].qty > product.stock) {
                res.status(400)
                throw new Error("Quantity Exceeds Available Stock")
            }


        } else {
            // Add New Product To Cart
            cart.products.push({ product: productId, qty })
        }
    }

    await cart.save()

    // Populate Product Details For Response
    await cart.populate({ path: 'products.product', populate: { path: 'shop', select: '_id name' } })

    res.status(200).json(cart)

}

const updateCart = async (req, res) => {
    const { productId, qty } = req.body;
    const userId = req.user._id;

    // Validate quantity
    if (qty < 1) {
        res.status(400)
        throw new Error("Quantity must be at least 1")
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404)
        throw new Error("Cart not found")
    }

    // Find product in cart
    const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
        res.status(404)
        throw new Error("Product not found in cart")
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    if (qty > product.stock) {
        res.status(400)
        throw new Error("Quantity exceeds available stock")
    }

    // Update quantity
    cart.products[productIndex].qty = qty;

    await cart.save();
    await cart.populate({ path: 'products.product', populate: { path: 'shop', select: '_id name' } });

    res.status(200).json(cart);
}

const removeCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404)
        throw new Error("Cart not found")
    }

    // Filter out the product
    cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate({ path: 'products.product', populate: { path: 'shop', select: '_id name' } });

    res.status(200).json(cart);

}


// Clear Cart
const clearCart = async (req, res) => {

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404)
        throw new Error("Cart Not Found!")
    }

    cart.products = [];
    await cart.save();

    res.status(200).json(cart);
};





const cartController = { addToCart, updateCart, removeCart, getCart, clearCart }

export default cartController