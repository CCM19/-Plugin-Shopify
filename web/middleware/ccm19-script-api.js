import express from 'express'
import bodyParser from 'body-parser'
import '@shopify/shopify-api/adapters/node'

import {
  deleteScript,
  deleteScriptFromDB,
  fetchScript,
  logger,
  modifyTemplateHelper, updateScriptEntry,
} from '../helpers/script-helper.js'
import { ScriptDB } from '../script-db.js'
import shopify from '../shopify.js'
import cors from 'cors'

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
 * Fetches the main template liquid for further manipulation
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
    logger.warn("error in getMainTemplate")
    logger.error(error);
    return error;
  }
}

/**
 *  gets the current main template
 * @param shop
 * @param accessToken
 * @returns {Promise<*>}
 */
async function getTemplate(shop,accessToken){
  try {
    return await getMainTemplate(shop, accessToken,await getMainThemeID(shop, accessToken));
  }catch (error) {
    logger.error("error in get template")
    logger.error(error)
    return error;
  }
}
/**
 *  sends the updated template to the shopify api
 *
 * @param shop
 * @param accessToken
 * @param updatedTemplate
 * @returns {Promise<any>}
 */
async function putTemplate(shop, accessToken, updatedTemplate) {

  const themeID =await  getMainThemeID(shop,accessToken)

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
    logger.error('error in putTemplate',error);
    return error;
  }
}

/**
 *fetches all data from User Shop
 *
 * @param shop
 * @param accessToken
 * @returns {Promise<*>}
 */
async function fetchShopData(shop, accessToken){
  try {
    const response = await fetch(`https://${shop}/admin/api/2023-04/shop.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });
    return await response.json();
  } catch (error) {
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
  app.use(cors())

  /**
   * sets the script for global use
   */
  app.post('/api/script/set', async (req, res) => {
    try {
      const script =  decodeURIComponent(await req.body.inputScript);
      await updateScriptEntry(await res.locals.shopify.session.shop, script);
      res.send({status: 'success', script});
    } catch (error) {
      res.status(500).send({status: 'error', message: error.message});
    }
  });
  /**
   * gets the script from db
   */
  app.get('/api/script/get',async (req,res)=>{
    try {
      const script = await fetchScript(res.locals.shopify.session.shop)
      res.status(200).json({ status: 'success', script });
    }catch (error) {
      res.status(500).send({status: 'error', message: error.message});
    }
  });

  /**
   * endpoint to remove the script from the template
   */
  app.get('/api/template/delete',async (req,res) =>{

    const shop = await res.locals.shopify.session.shop;

    try{

      const template = await getTemplate(shop,res.locals.shopify.session.accessToken);

      const modifiedTemplate = await deleteScript(template, shop);

      const response = await putTemplate(shop, res.locals.shopify.session.accessToken, modifiedTemplate);

      logger.warn(`Removed Script of ${shop} from Template`);

      try {

        const shopData = await ScriptDB.readByShopDomain(shop);
        const dbDelete = await deleteScriptFromDB(shopData.entryId);
        logger.warn(`Removed Script with id ${dbDelete} from Database`)

      }catch (error) {
        logger.error(`Error while trying to remove Database entry for ${shop}`)
        res.status(500).send({status: 'error', message: error.message});
      }

      res.send({status: 'success', response});
    }catch (error) {
      logger.error(error);
      res.status(500).send({status: 'error', message: error.message});
    }
  });

  /**
     * modifies the template with the script
     */
  app.get('/api/template/modify', async (req, res) => {
    try {
      const shop = res.locals.shopify.session.shop;

      const template = await getTemplate(shop,res.locals.shopify.session.accessToken)

      const modifiedTemplate = await modifyTemplateHelper(await fetchScript(shop), template, shop);

      const response = await putTemplate(shop, res.locals.shopify.session.accessToken, modifiedTemplate);

      logger.warn(`modified Template of ${shop}`);
      res.send({status: 'success', response});
    } catch (error) {
      logger.error(error);
      res.status(500).send({status: 'error', message: error.message});
    }
  });

  /**
   * Billing endpoint returns the billing url
   */
  app.post('/api/billing/set-plan',async (req,res) =>{
    try{
      const session = res.locals.shopify.session;

      const confirm =await shopify.api.billing.request({
        session,
        plan: req.body.billingPlan,
        isTest: true,
        returnObject: true
      });
      const shopData = await fetchShopData(res.locals.shopify.session.shop, res.locals.shopify.session.accessToken);
      
      res.status(200).json({ redirectUrl: confirm });
    }catch (error){
      logger.debug(error)
      res.status(500).send({message:error.message})
    }
  })

  /**
   * Mandatory webhook section
   */
  app.get('/customers/data_request', async (req, res) => {
    logger.warn("customer data has been requested")
    try {
      res.status(200).send({status:'success'});
    }catch (e) {
      logger.error(e)
      res.status(500).send({status:'error'});
    }
  });

  app.get('/customers/redact', async (req, res) => {
    logger.warn("customer redact has been requested")
    try {
      res.status(200).send({status:'success'});
    }catch (e) {
      logger.error(e)
      res.status(500).send({status:'error'});
    }
  });



  app.get('/shop/redact', async (req, res) => {
    logger.warn("shop redact has been requested")
    const shop = req.body.shopDomain;
    try {
      const shopData = await ScriptDB.readByShopDomain(shop);
      const dbDelete = await deleteScriptFromDB(shopData.entryId);
      res.status(200).send({status:'success'},);
    }catch (e) {
      logger.error(e)
      res.status(500).send({status:'error'});
    }
  });
}