import shopify from "../shopify.js";
import {ScriptDb} from "../ccm19-script-db.js";

//retrieves the shop url
export async function getShopUrlFromSession(req, res) {
    return `https://${res.locals.shopify.session.shop}`;
}
