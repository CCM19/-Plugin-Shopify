// i18n.js

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  de: {
    translation: {
      form: {
        field: {
          label: 'Fügen Sie hier den Code-Snippet aus dem CCM19 Backend ein.',
          button: 'Speichern',
          delete: 'Löschen',
          homepage: 'Herzlich willkommen bei der offiziellen App für die Integration des CCM19 in Shopify. Sie benötigen lediglich den CCM19-Backend-Code-Snippet, um die App zu nutzen. Sie haben noch keinen? Dann registrieren Sie sich jetzt unter: ',
          link: "https://www.ccm19.de/",
          errorMessage: "Der eingegebene Code ist leider falsch. Bitte überprüfen Sie den Code auf Fehler. Oder kontaktieren Sie den Support.",
          successMessage: "Der Code-Snippet wurde erfolgreich eingebunden.",
          emptyInputMessage: "Eingabe leer.",
          deleteMessage: "Code-Snippet wurde aus dem Template erfolgreich entfernt",
          internalErrorMessage: "Es ist ein interner Fehler aufgetreten. Bitte kontaktieren Sie den Support. Vielen Dank für Ihr Verständnis.",
        },
      },
    },
  },
  en: {
    translation: {
      form: {
        field: {
          label: 'Please enter the code snippet from the CCM19 backend',
          button: 'Save',
          delete: 'Delete',
          homepage: 'Welcome to the official CCM19 integration application. To use it you need the code snippet from the CCM19 backend. Don\'t have one? Then register now at:',
          link: "https://www.ccm19.de/",
          errorMessage: "The code snippet is incorrect, please correct your input or contact support.",
          successMessage: "The code snippet has been successfully integrated.",
          emptyInputMessage: "Empty input. Please enter your CCM19 code.",
          deleteMessage:"Script deleted from template",
          internalErrorMessage: "Internal error. Please contact support.",
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
}, (err, t) => {
  if (err) { return console.log("error while loading translation", err); }
  t('key');
});

export default i18n;
