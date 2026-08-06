import Coupon from "../models/couponModel.js"

const getCoupons = async (req, res) => {

    let shopId = req.params.sid

    const coupons = await Coupon.find({ shop: shopId })

    if (!coupons) {
        res.status(404)
        throw new Error('Coupon Not Found!')
    }

    res.status(200).json(coupons)

}
const applyCoupon = async (req, res) => {

    const { couponCode, shopId } = req.body

    if (!couponCode || !shopId) {
        res.status(409)
        throw new Error("Please Send Coupon & Shop Id")
    }

    const couponExists = await Coupon.findOne({ couponCode: couponCode.trim().toUpperCase() })

    if (!couponExists) {
        res.status(404)
        throw new Error("Invalid Coupon")
    }

    if (couponExists.shop.toString() !== shopId) {
        res.status(409)
        throw new Error("This Coupon Is Not Valid For This Shop")
    }


    if (couponExists.isActive) {
        res.status(200).json(couponExists)
    } else {
        res.status(409)
        throw new Error("Expired Coupon")
    }
}


const couponController = { getCoupons, applyCoupon }


export default couponController