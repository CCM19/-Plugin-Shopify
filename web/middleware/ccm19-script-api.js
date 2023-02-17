import express from "express";
import { ScriptDb } from "../ccm19-script-db.js";
import bodyParser from "body-parser";
import '@shopify/shopify-api/adapters/node';
import {ApiVersion, Shopify} from '@shopify/shopify-api';
import { getSessionToken } from '@shopify/app-bridge-utils';

import winston, {transports} from "winston";
import createAppBridge from "@shopify/app-bridge";

const app = express();
const port = process.env.PORT || 5000;


const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/app.log' })
    ]
});


async function getMainThemeID(shop, accessToken){
    const query = `
    {
      shop {
        id
        name
        primaryDomain {
          url
        }
        themes(first: 10) {
          edges {
            node {
              id
              name
              role
              themeStoreId
              previewable
              processing
              storefrontPreviewable
              // livePreviewable
              // templateSuffix
            }
          }
        }
      }
    }
  `;

    const response = await fetch(`https://${shop}/admin/api/2023-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({ query })
    });
    const responseJson = await response.json();
    const themes = responseJson.data.shop.themes.edges;
    const mainTheme = themes.find((theme) => theme.node.role === 'main');
    return mainTheme.node.id;
}

async function getMainTemplate(shop, accessToken, themeID){
    const assetKey = `templates/index.liquid`;
    const response = await fetch(`https://${shop}/admin/api/2023-01/themes/${themeID}/assets.json?asset[key]=${assetKey}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
        }
    });
    const responseJson = await response.json();
    return responseJson.asset.value;
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

    app.get('/api/script/load', async (req, res) => {
        try {
            const script = await ScriptDb.read(1);
            return res.send(script.script);
        } catch (error) {
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


    app.get('/api/shop-data', async (req, res) => {


        const appBridgeConfig = {
            apiKey: process.env.SHOPIFY_API_KEY,
            shopOrigin: req.query.shop,
            forceRedirect: true,
        };
        const appBridge = createAppBridge(appBridgeConfig);



        const { shop, accessToken } = await getSessionToken(appBridge);


        try {
            const themeID = await getMainThemeID(shop, accessToken);
            const mainTemplate = await getMainTemplate(shop, accessToken, themeID);
            res.send({
                status: 'success',
                data: { mainTemplate }
            });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    });
    app.use(ApiVersion.Unstable, (req, res, next) => {
        next();
    });

    // Handle errors
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send({ status: 'error', message: err.message });
    });


}
