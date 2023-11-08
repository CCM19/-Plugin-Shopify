import winston from 'winston';

import {ScriptDB} from '../script-db.js';
import {fetchScriptFromCcm} from '../middleware/ccm19-script-api.js';

// debug and error logger

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
      ),
    }),
  ],
});

/**
 * fetches script from DB
 *
 * @param shopDomain
 * @returns {null|*}
 */
export async function fetchScript(shopDomain) {
  try {
    await ScriptDB.init();

    const shop = await ScriptDB.readByShopDomain(shopDomain);
    if (!shop) {
      logger.error(`No such a shop in DB:${shopDomain} `);
      return null;
    }
    return shop.scriptContent;

  } catch (error) {
    logger.error("fetchScript error:", error);
    return error;
  }
}

/**
 * updates the script entry in the DB
 *
 * @param shopDomain
 * @param script
 * @returns {Promise<void>}
 */
export async function updateScriptEntry(shopDomain, script) {
  try {
    await ScriptDB.init();
    const existingEntry = await ScriptDB.readByShopDomain(shopDomain);
    if (existingEntry) {
      await ScriptDB.update(existingEntry.id, {scriptContent: script});

    }
  } catch (error) {
    logger.error("error update Script entry via ShopDomain", error);
  }
}

/**
 *  adds the script to the db after the script has been acquired
 *
 * @param shopId
 * @returns {Promise<boolean>}
 */
export async function addScriptEntry(shopId) {
  const CcmResponse = await fetchScriptFromCcm(shopId);
  try {
    const shopEntry = await ScriptDB.readByShopId(shopId);
    if (shopEntry) {
      const script = CcmResponse.content;
      const decodedScript = decodeURIComponent(script);
      const response = await ScriptDB.update(shopEntry.shopDataId, {scriptContent: decodedScript});

      logger.warn("added script for", shopEntry);
      return response;
    } else {
      logger.error("Shop entry not found for ShopId", shopId);
    }
  } catch (error) {
    logger.error("couldn't add Script entry", error);
    return error;
  }
}

/**
 * creates the new DB entry's for the shops
 *
 * @param shopData
 * @param abo
 * @returns {Promise<string>}
 */
export async function createNewEntry(shopData, abo) {
  try {
    await ScriptDB.init();
    const shopObject = shopData.shop;
    const existingEntry = await ScriptDB.readByShopId(shopObject.id.toString());
    if (!existingEntry) {
      const newEntryId = await ScriptDB.addShopData({
        shopId: shopObject.id.toString(), // to avoid getting it saved as dotted notation
        name: shopObject.shop_owner,
        company: shopObject.name,
        eMail: shopObject.email,
        abo,
      });

      const newAddressEntry = await ScriptDB.addAddress({
        country: shopObject.country_name,
        streetAddress: shopObject.address1,
        additionalAddress: shopObject.address2,
        city: shopObject.city,
        zip: shopObject.zip,
        shopDataId: newEntryId,
      });

      const newScriptTableEntry = await ScriptDB.createScriptEntry({
        shopDomain: shopObject.myshopify_domain,
        scriptContent: "",
        shopDataId: newEntryId,
      });

      logger.warn(`New Entry generated at ${JSON.stringify(newEntryId)}`);

      return newEntryId;

    } else if (existingEntry) {
      logger.error(`Shop ${shopObject.name} already exists at ${JSON.stringify(existingEntry)}`);
      return existingEntry;
    }
  } catch (error) {
    logger.error("error while generating new Entry", error);
    return error;
  }

}

/**
 *Generates Pattern from cleaned fetched script
 *
 * @param shopDomain
 * @returns {RegExp}
 */
async function fetchPattern(shopDomain) {
  const fetcher = await fetchScript(shopDomain);
  const script = await stripScript(fetcher);

  const decodedScript = decodeURIComponent(script);

  const regexPattern = `<script\\s+src=["']${decodedScript.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']\\s*(?:\\s+\\S+="[^"]*")*\\s*>\\s*</script>`;
  return new RegExp(regexPattern);
}

/**
 *Cuts the html surrounding from the script
 *
 * @param script
 * @returns {null|*}
 */
export async function stripScript(script) {
  const syncedScript = await script;
  const matches = syncedScript.match(/\bsrc=([\'"])((?:[^"\'?#]|(?!\1)[\"\'])*\/(?:ccm19|app)\.js\?(?:[^"\']|(?!\1).)*?)\1/i);
  if (matches && matches[2]) {
    return matches[2];
  } else {
    return null;
  }
}

/**
 * searches and removes the script in the liquid
 *
 * @param template
 * @param shopDomain
 * @returns {template}
 */
export async function deleteScript(template, shopDomain) {

  const pattern = await fetchPattern(shopDomain);

  try {
    let updatedTemplate;

    if (pattern.test(template)) {
      updatedTemplate = template.replace(pattern, ' ');
      logger.warn("script removed");
    } else {
      logger.warn("no script to remove found");
      return template;
    }
    return updatedTemplate;

  } catch (error) {
    logger.error("error in deleteScript", error);
    return template;
  }
}

/**
 *
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteScriptFromDB(id) {
  try {
    await ScriptDB.delete(id);
    return id;
  } catch (error) {
    logger.error("couldn`t remove script from DB", error);
    return error;
  }
}

/**
 * writes the encoded script in the beginning of the <head> if a head is available. If there is non it writes it into the end of the body.
 *
 * @param script
 * @param template
 * @param shopDomain
 * @returns {Promise<string|*>}
 */
export async function modifyTemplateHelper(script, template, shopDomain) {

  const pattern = await fetchPattern(shopDomain);

  try {

    let updatedTemplate;
    if (pattern.test(template)) {

      // If the existing script tag is found, replace it with the new script
      updatedTemplate = template.replace(pattern, `\n${script}\n`);
      logger.warn("Replaced current version of the script");

    } else {

      // If no existing script tag is found, insert the new script after the opening head tag
      const headIndex = template.indexOf('<head>');

      if (headIndex === -1) {

        // If the opening head tag is not found, append the new script to the end of the body
        updatedTemplate = template.replace('</body>', `\n${script}\n`);
        logger.warn('No Head found in Template');

      } else {
        // If the opening head tag is found, insert the new script immediately after it
        updatedTemplate = `${template.substring(0, headIndex + 6)}\n${script}\n${template.substring(headIndex + 6)}`;
      }
    }

    return updatedTemplate;
  } catch (error) {
    logger.error("error in modifyTemplateHelper", error);
    return template;
  }
}

export async function shopRedactHelper(shopId) {
  try {
    if (await ScriptDB.readByShopId(shopId)) {
      return await ScriptDB.deleteTablesByShopId(shopId);
    }
  } catch (error) {
    logger.error("error in Webhook triggered delete of DB entry", error);
    return error;
  }
}

/*
//Db debug stuff
async function listAllEntries() {
  try {
    await ScriptDB.init();

    // Call the list method without specifying a shopDomain to retrieve all entries
    const entries = await ScriptDB.listAll();

    if (entries.length === 0) {
      console.log('No entries found in the database.');
    } else {
      logger.debug('All entries in the database:');
      logger.debug(entries);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    // Handle the error appropriately
  }
}*/
