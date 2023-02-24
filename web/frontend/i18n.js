// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            form: {
                field: {
                    label: 'Pleas enter the code-snippet from the CCM19 backend',
                    button: 'save',
                    homepage:'Welcome to the official CCM19 Integration app. For Usage you will need the code-snippet from the CCM19 backend. Dont have one? Than register now at:',
                    link:"https://www.ccm19.de/",
                },
            },
        },
    },
    ger: {
        translation: {
            form: {
                field: {
                    label: 'Bitte geben Sie hier den Code-Schnipsel vom CCM19 Backend ein.',
                    button: 'Speichern',
                    homepage: ' Willkommen in der offizielen App zur CCM19 Integration in Shopify. Zur benutzung bedarf es nur den COde Schnipsel aus dem CCM19 Backend. Sie haben noch keinen? Dann registrieren sie sich jetzt unter:',
                    link:"https://www.ccm19.de/",
                },
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'ger',
    fallbackLng: 'en',
});

export default i18n;

