import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const forAuthUsers = async (req, res, next) => {

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password")

            if (!user) {
                res.status(400)
                throw new Error('You are not Authorised! : Invalid Token')
            }

            if (!user.isActive) {
                res.status(403)
                throw new Error('Your account has been deactivated. Please contact support.')
            }

            req.user = user
            next()
        } else {
            res.status(400)
            throw new Error('You are not Authorised! No Token Found!')
        }


    } catch (error) {
        res.status(400)
        throw new Error('You are not Authorised!')
    }


}



const forAdmin = async (req, res, next) => {

    try {

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password")

            if (!user) {
                res.status(400)
                throw new Error('You are not Authorised! : Invalid Token')
            }


            if (user.isAdmin) {
                req.user = user
                next()
            } else {
                res.status(400)
                throw new Error('You are not Authorised! : Admin Only Access')
            }

        } else {
            res.status(400)
            throw new Error('You are not Authorised! No Token Found!')
        }


    } catch (error) {
        res.status(400)
        throw new Error('You are not Authorised! : Admin Only Access')
    }


}

const protect = { forAuthUsers, forAdmin }


export default protect