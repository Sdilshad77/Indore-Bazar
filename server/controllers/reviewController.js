import Order from "../models/orderModel.js"
import Review from "../models/reviewModel.js"

const getReviews = async (req, res) => {

    const productId = req.pid


    let reviews = await Review.find({ product: productId })
        .populate("user", "name")
        .populate("product", "name productImage")

    if (!reviews) {
        res.status(404)
        throw new Error("Reviews Not Found")
    }

    res.status(200).json(reviews)

}

const getFeaturedReviews = async (req, res) => {

    const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("user", "name")
        .populate("product", "name productImage")

    res.status(200).json(reviews)

}


const addReview = async (req, res) => {

    const productId = req.pid
    const userId = req.user._id

    const { rating, text } = req.body

    if (!rating || !text) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Find If this product is in users order history
    let purchasedBefore = false
    const orderHistory = await Order.find({ user: userId })

    outer: for (const orders of orderHistory) {
        for (const order of orders.products) {
            if (order.product && order.product.toString() === productId) {
                purchasedBefore = true
                break outer
            }
        }
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating: rating,
        text: text,
        isVerifiedBuyer: purchasedBefore || false
    })

    await review.populate("user", "name")

    res.status(201).json(review)

}

const removeReview = async (req, res) => {
    const reviewId = req.params.rid

    const review = await Review.findById(reviewId)

    if (!review) {
        res.status(404)
        throw new Error("Review Not Found!")
    }

    // Only the review author or an admin can delete it
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403)
        throw new Error("You are not authorised to delete this review!")
    }

    await Review.findByIdAndDelete(reviewId)

    res.status(200)
        .json({
            message: "Review Removed",
            _id: reviewId
        })


}


const reviewController = { getReviews, getFeaturedReviews, addReview, removeReview }

export default reviewController