import winston from "winston";

//debug and error logger

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/app.log'
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

/**
 * writes the encoded script int the beginning of the <head> if a head is available. If their is no head it writes it into the end of the body.
 *
 * @param script
 * @param template
 * @returns {Promise<string|*>}
 */
export async function modifyTemplateHelper(script, template) {
    try {
        // Define the regex pattern to look for the existing script tag
        const pattern = /<script\s+src="(https?:\/\/[^\/]+\/public\/(ccm19|app)\.js\?[^"]+)"\s+referrerpolicy="origin">\s*<\/script>/i;
        const existingScriptMatch = template.match(pattern);
        const decodedScript = decodeURI(script);

        let updatedTemplate;
        if (existingScriptMatch) {
            // If the existing script tag is found, replace it with the new script
            updatedTemplate = template.replace(pattern,'\n'+decodedScript+'\n');
        } else {
            // If no existing script tag is found, insert the new script after the opening head tag
            const headIndex = template.indexOf('<head>');
            if (headIndex === -1) {
                // If the opening head tag is not found, append the new script to the end of the body
                updatedTemplate = template.replace('</body>','\n'+decodedScript+'\n');
            } else {
                // If the opening head tag is found, insert the new script immediately after it
                updatedTemplate = template.substring(0, headIndex + 6) + '\n'+decodedScript+'\n' + template.substring(headIndex + 6);
            }
        }

        return updatedTemplate;
    } catch (error) {
        logger.error(error);
        return template;
    }
}
