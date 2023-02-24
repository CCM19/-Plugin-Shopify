import express from "express";
import {ScriptDb} from "../ccm19-script-db.js";
import bodyParser from "body-parser";
import '@shopify/shopify-api/adapters/node';
import winston, {transports} from "winston";
import fetch from "node-fetch";
import Shopify from "shopify-api-node";

const port = process.env.PORT || 5000;


const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/app.log' })
    ]
});



async function getMainThemeID(shop, accessToken){
    console.error(shop)
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
async function getMainTemplate(shop, accessToken, themeID){
    try {

        const assetKey = `templates/layout/theme.liquid`;
        const response = await fetch(`https://${shop}/admin/api/2023-01/themes/${themeID}/assets.json?asset[key]=${assetKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            }
        });
        const responseData = await response.json();
        const fileContents = responseData.asset && responseData.asset.value;
        return fileContents;
    } catch (error) {
        logger.error(error);
    }
}



export default function applyScriptApiEndpoints(app) {

    app.use(express.json());
    app.use(bodyParser.json());


    app.post('/api/script/save', async (req, res) => {
        try {
            const { value } = req.body;
            const existingScript = await ScriptDb.read(1);
            let scriptId;
            if (existingScript) {
                await ScriptDb.update(1, { script: value });
                scriptId = existingScript.id;
            } else {
                scriptId = await ScriptDb.create({ script: value });
            }
            res.send({ status: 'success', scriptId });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    });

    app.get('/api/script-load', async (req, res) => {
        try {
            const script = await ScriptDb.read(1);
            logger.debug(script);
            return res.send(script);
        } catch (error) {
            logger.error(error);
            return res.status(404).send({ status: 'error', message: error.message });
        }
    });

    app.get('/api/get/db/status', async (req,res)=>{
        try{
            await ScriptDb.init();
            const isConnected = ScriptDb.isConnected();
            res.send({status:'success',isConnected});
        }catch (error) {
            res.status(500).send({status:'error',message:error.message});
        }
    })

    const getShopData = async (shop, accessToken) => {
        const shopify = new Shopify({
            shopName: shop,
            accessToken: accessToken,
            apiVersion: '2023-01'
        });

        return await shopify.shop.get();
    };

    app.get('/api/shop-data', async (req, res) => {

        const shop = res.locals.shopify.session.shop;
        const accessToken = res.locals.shopify.session.accessToken;

        const shopData = await getShopData(shop,accessToken);
        const apiKey= shopData.myshopify_domain;

        const themeID = await getMainThemeID(shop, accessToken);
        const template = await getMainTemplate(shop, accessToken, themeID);
        logger.debug("---------------------------------------------------------")
        logger.debug(template);

        try {
            res.status(200).send({
                status: 'success',
                data: {
                    shop,
                    accessToken,
                    template
                }
            });
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message});
        }
    });

    // Handle errors
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send({ status: 'error', message: err.message });
    });



}
