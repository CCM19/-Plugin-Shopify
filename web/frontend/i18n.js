// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    de: {
        translation: {
            form: {
                field: {
                    label: 'Bitte geben Sie hier den Code-Schnipsel vom CCM19 Backend ein.',
                    button: 'Speichern',
                    homepage: ' Willkommen in der offizielen App zur CCM19 Integration in Shopify. Zur benutzung bedarf es nur den Code-Schnipsel aus dem CCM19 Backend. Sie haben noch keinen? Dann registrieren sie sich jetzt unter: ',
                    link:"https://www.ccm19.de/",
                    errorMessage: "Der eingegebene Code-Schnipsel ist leider Falsch. Bitte überprüfen Sie diesen auf Fehler oder kontaktieren Sie den Support.",
                    successMessage: "Der Code-Schnipsel wurde erfolgreich Integriert. "
                },
            },
        },
    },
    en: {
        translation: {
            form: {
                field: {
                    label: 'Pleas enter the code-snippet from the CCM19 backend',
                    button: 'save',
                    homepage:'Welcome to the official CCM19 Integration app. For Usage you will need the code-snippet from the CCM19 backend. Dont have one? Than register now at: ',
                    link:"https://www.ccm19.de/",
                    errorMessage: "The code-snippet is wrong pleas correct your input or contact support.",
                    successMessage: "The code-snippet has been <u>successful<u/> integrated."
                },
            },
        },
    },

};

i18n.use(initReactI18next).init({
    resources,
    lng: 'de',
    fallbackLng: 'en',
    debug: true,
}, (err,t)=> {
    if(err) return console.log("error while loading translation",err);
    t('key');
});

export default i18n;

