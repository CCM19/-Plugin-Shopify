import winston from 'winston';
import {ScriptDB} from "../script-db.js";

// debug and error logger

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
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
      logger.error(`No such a shop in DB:${shopDomain} `)
      return null;
    }
    return shop.scriptContent;

  } catch (e) {
    logger.error("fetchScript error:",e)
    return null
  }
}

/**
 * creates a new DB entry if an entry is not already in DB
 *
 * @param shopDomain
 * @param script
 * @returns {Promise<void>}
 */
export async function createNewEntry(shopDomain, script) {
  try {
    // Initialize the ScriptDB if it's not already initialized
    await ScriptDB.init();
    const existingEntry = await ScriptDB.readByShopDomain(shopDomain);

    if (!existingEntry) {
      // Call the create method to insert a new record
      const newEntryId = await ScriptDB.create({
        shopDomain: shopDomain,
        scriptContent: script,
      });
      console.log(`New entry created with ID: ${newEntryId}`);

    } else if (existingEntry && existingEntry.scriptContent !== script) {
      await ScriptDB.update(existingEntry.id, { scriptContent: script });
      console.log(`Entry has been updated for shop: ${shopDomain}`);
    }
  } catch (error) {
    console.error('Error occurred while create entry:', error);
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
  }else{
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
export async function deleteScript(template, shopDomain){

  const pattern = await fetchPattern(shopDomain)

  try{
    let updatedTemplate;

    if(pattern.test(template)){
      updatedTemplate=template.replace(pattern,' ');
      logger.warn("script removed");
    }else{
      logger.warn("no script to remove found");
      return template;
    }
      return updatedTemplate;

  }catch (error) {
    logger.error("error in deleteScript",error);
    return template;
  }
}

/**
 *
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteScriptFromDB(id){
  try {
    await ScriptDB.delete(id)
    return id;
  }catch (e) {
    logger.error("couldnt remove script from DB",e)
    return e;
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

  const pattern = await fetchPattern(shopDomain)

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
    logger.error("error in modifyTemplateHelper",error);
    return template;
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
