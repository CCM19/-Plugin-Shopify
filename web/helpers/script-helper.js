import winston from 'winston';

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
 * searches and removes the script in the liquid
 *
 * @param template
 * @returns {template}
 */
export function deleteScript(template){
  const pattern = /<script\s+src="(https?:\/\/[^\/]+\/public\/(ccm19|app)\.js\?[^"]+)"\s+referrerpolicy="origin">\s*<\/script>/i;
  try{
    let updatedTemplate;

    if(template.match(pattern)){
      updatedTemplate=template.replace(pattern,' ');
      logger.warn("script removed");
    }else{
      logger.warn("no script to remove found");
      return template;
    }
      return updatedTemplate;

  }catch (error) {
    logger.warn("couldnt remove script")
    logger.error(error);
    return template;
  }
}


/**
 * writes the encoded script in the beginning of the <head> if a head is available. If there is non it writes it into the end of the body.
 *
 * @param script
 * @param template
 * @returns {Promise<string|*>}
 */
export function modifyTemplateHelper(script, template) {

  const pattern = /<script\s+src="(https?:\/\/[^\/]+\/public\/(ccm19|app)\.js\?[^"]+)"\s+referrerpolicy="origin">\s*<\/script>/i;
  try {

    let updatedTemplate;
    if (template.match(pattern)) {

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
    logger.error(error);
    return template;
  }
}
