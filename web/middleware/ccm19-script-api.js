import express from "express";
import bodyParser from "body-parser";
import "@shopify/shopify-api/adapters/node";
import fetch from "node-fetch";
import Shopify from "shopify-api-node";

import {logger, modifyTemplateHelper} from "../helpers/script-helper.js";
import {createApp} from "@shopify/app-bridge";
import {getSessionToken} from "@shopify/app-bridge-utils";

let script;

/**
 * Fetches the ID of the Main theme of the store via the shopify api
 * @param shop  shopUrl
 * @param accessToken OAuth generated token
 * @returns {Promise<*>}
 */
async function getMainThemeID(shop, accessToken) {
  try {
    const response = await fetch(`https://${shop}/admin/themes.json?role=main`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });
    const data = await response.json();
    return data.themes[0].id;
  } catch (error) {
    logger.error(error);
    return error;
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

async function getMainTemplate(shop, accessToken, themeID) {
  try {
    const assetKey = 'layout/theme.liquid';
    const response = await fetch(`https://${shop}/admin/api/2023-01/themes/${themeID}/assets.json?asset[key]=${assetKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });
    const responseData = await response.json();
    return responseData.asset && responseData.asset.value;
  } catch (error) {
    logger.error(error);
    return error;
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
async function putTemplate(shop, accessToken, themeID, updatedTemplate) {
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
    logger.error('error in putTemplate');
    logger.error(error);
    return error;
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



  app.post('/api/script/set', async (req, res) => {
    try {
      script =decodeURIComponent( await req.body.inputScript);
      res.send({status: 'success', script});
    } catch (error) {
      res.status(500).send({status: 'error', message: error.message});
    }
  });

  /**
     * collects all the needed data for modification of the template and starts it
     *
     */
  app.get('/api/template/modify', async (req, res) => {
    try {
      const themeID = await getMainThemeID(res.locals.shopify.session.shop, res.locals.shopify.session.accessToken);

      const template = await getMainTemplate(res.locals.shopify.session.shop, res.locals.shopify.session.accessToken, themeID);

      const modifiedTemplate = await modifyTemplateHelper(script, template);

      const response = await putTemplate(res.locals.shopify.session.shop, res.locals.shopify.session.accessToken, themeID, modifiedTemplate);

      res.send({status: 'success', response});
    } catch (error) {
      logger.error(error);
      res.status(500).send({status: 'error', message: error.message});
    }
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({status: 'error', message: err.message});
  });

}
