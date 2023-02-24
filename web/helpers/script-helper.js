
//retrieves the shop url
export async function getShopUrlFromSession(req, res) {
    return `https://${res.locals.shopify.session.shop}`;
}