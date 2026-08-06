import Shop from "../models/shopModel.js"

const getShops = async (req, res) => {

    const shops = await Shop.find()



    if (!shops) {
        res.status(404)
        throw new Error('Shops Not Found')
    }

    let activeShops = shops.filter(shop => shop.status === "accepted")

    res.status(200).json(activeShops)

}

const getShop = async (req, res) => {
    const shop = await Shop.findById(req.params.sid)

    if (!shop || shop.status !== "accepted") {
        res.status(404)
        throw new Error('Shop Not Found')
    }


    res.status(200).json(shop)
}


const shopController = { getShops, getShop }


export default shopController