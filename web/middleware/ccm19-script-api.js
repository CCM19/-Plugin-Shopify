import express from "express";
import {ScriptDb} from "../ccm19-script-db.js";
import bodyParser from "body-parser";
import '@shopify/shopify-api/adapters/node';
import fetch from "node-fetch";
import Shopify from "shopify-api-node";
import {logger, modifyTemplateHelper} from "../helpers/script-helper.js";

const port = process.env.PORT || 5000;

/**
 * Fetches the ID of the Main theme of the store via the shopify api
 * @param shop  shopUtl
 * @param accessToken OAuth generated token
 * @returns {Promise<*>}
 */
async function getMainThemeID(shop, accessToken){
    try {

        const response = await fetch(`https://${shop}/admin/themes.json?role=main`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken,
            },
        });
        const data = await response.json();
        return data.themes[0].id;
    }catch (error){
        logger.error(error);
    }
}

/**
 * Fetches  the main template liquid for further manipulation
 *
 * @param shop shopUrl
 * @param accessToken
 * @param themeID retrieved from getMainThemeID
 * @returns {Promise<*>}
 */

async function getMainTemplate(shop, accessToken, themeID){
    try {

        const assetKey = `layout/theme.liquid`;
        const response = await fetch(`https://${shop}/admin/api/2023-01/themes/${themeID}/assets.json?asset[key]=${assetKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            }
        });
        const responseData = await response.json();
        return responseData.asset && responseData.asset.value;
    } catch (error) {
        logger.error(error);
    }
}

/**
 *  sends the updated template to the shopify api
 *
 * @param shop
 * @param accessToken
 * @param themeID
 * @param updatedTemplate
 * @returns {Promise<any>}
 */
async function updateTemplate(shop, accessToken, themeID, updatedTemplate) {
    try {
        const assetKey = 'layout/theme.liquid';
        const response = await fetch(`https://${shop}/admin/api/2023-01/themes/${themeID}/assets.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken,
            },
            body: JSON.stringify({
                asset: {
                    key: assetKey,
                    value: updatedTemplate,
                },
            }),
        });
        return await response.json();
    } catch (error) {
        logger.error("error in updateTemplate")
        logger.error(error);
    }
}

/**
 * applyScriptApiEndpoints
 *
 * @param app
 */
export default function applyScriptApiEndpoints(app) {

    app.use(express.json());
    app.use(bodyParser.json());

    const getShopData = async (shop, accessToken) => {
        const shopify = new Shopify({
            shopName: shop,
            accessToken: accessToken,
            apiVersion: '2023-01'
        });

        return await shopify.shop.get();
    };


    /**
     * saves the script into the db if there is already a script it updates it.
     */
    app.post('/api/script/save', async (req, res) => {
        try {
            const { inputScript } = req.body;
            const existingScript = await ScriptDb.read(1);
            let scriptId;
            if (existingScript) {
                await ScriptDb.update(1, { script: inputScript });
                scriptId = existingScript.id;
            } else {
                scriptId = await ScriptDb.create({ script: inputScript });
            }
            res.send({ status: 'success', scriptId });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    });
    /**
     * checks db connection
     */
    app.get('/api/get/db/status', async (req,res)=>{
        try{
            await ScriptDb.init();
            const isConnected = ScriptDb.isConnected();
            res.send({status:'success',isConnected});
        }catch (error) {
            logger.error(error)
            res.status(500).send({status:'error',message:error.message});
        }
    })

    /**
     * collects all the needed data for modification of the template and starts it
     *
     */
    app.get('/api/template/modify', async (req, res) => {
        try {

            const shopData = await getShopData(res.locals.shopify.session.shop, res.locals.shopify.session.accessToken);


            const themeID = await getMainThemeID(shopData.myshopify_domain,  res.locals.shopify.session.accessToken);

            const template = await getMainTemplate(shopData.myshopify_domain.toString(),  res.locals.shopify.session.accessToken, themeID);

            const script = await ScriptDb.read(1);

            const modifiedTemplate = await modifyTemplateHelper(script.script,template);

            const response = await updateTemplate(shopData.myshopify_domain,res.locals.shopify.session.accessToken,themeID,modifiedTemplate);

            res.send({status:'success',response})
        } catch (error) {
            logger.error(error);
            res.status(500).send({status: 'error', message: error.message});
        }
    });


    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send({ status: 'error', message: err.message });
    });



}
