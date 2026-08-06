import Product from "../models/productModel.js"

const getProducts = async (req, res) => {
    const products = await Product.find().populate('shop')

    if (!products) {
        res.status(404)
        throw new Error('Products Not Found!')
    }

    // Only show products from approved & live shops.
    // Products with a missing/invalid shop ref are still shown
    // (frontend falls back to the "Indore Bazar" label).
    const liveProducts = products.filter(
        (p) => !p.shop || p.shop.status === "accepted"
    )

    res.status(200).json(liveProducts)

}

const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.pid).populate("shop")

    if (!product) {
        res.status(404)
        throw new Error('Product Not Found!')
    }

    res.status(200).json(product)
}


const searchProduct = async (req, res) => {
    const query = req.params.query?.trim()

    if (!query) {
        res.status(400)
        throw new Error("Please provide a search query")
    }

    const products = await Product.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
        ],
    }).populate("shop")

    res.status(200).json(products)
}

const productController = { getProduct, getProducts, searchProduct }


export default productController