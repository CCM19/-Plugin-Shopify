// i18n.js

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  de: {
    translation: {
      form: {
        field: {
          label: 'Um CCM19 in Ihren Shop zu integrieren, kopieren Sie einfach den Code-Schnipsel, den Sie auf dem Dashboard Ihrer Domain-Konfiguration in CCM19 finden, in das nachstehende Feld:',
          button: 'Speichern',
          homepage: 'Um CCM19 in Ihren Shop zu integrieren, kopieren Sie einfach den Code-Schnipsel, den Sie auf dem Dashboard Ihrer Domain-Konfiguration in CCM19 finden, in das nachstehende Feld: ',
          errorMessage: "Der eingegebene Code ist leider falsch. Bitte überprüfen Sie den Code auf Fehler. Oder kontaktieren Sie den Support.",
          successMessage: "Der Code-Schnipsel wurde erfolgreich eingebunden.",
          emptyInputMessage: "Eingabe leer. Code-Schnipsel entfernt.",
          internalErrorMessage: "Es ist ein interner Fehler aufgetreten. Bitte kontaktieren Sie den Support. Vielen Dank für Ihr Verständnis.",
        },
      },
      billing:{
        free:"Free",
        submit:"Jetzt ausprobieren",
        listText: "Enthält alle Standard Features\n" +
            "und zusätzlich",
        features: {
          Feature1: "Alle Daten in Deutschland, keine US Anbieter.",
          Feature2: "1 Domain inkl.",
          Feature3: " 5.000 Impressions / Monat inkl.",
          Feature4: "TTDSG-, DSGVO-, CCPA-, BDSG-, LGPD-, POPIA-konform",
          Feature5: "1 User"
        }
      }
    },
  },
  en: {
    translation: {
      form: {
        field: {
          label: 'Please enter the code snippet from the CCM19 backend',
          button: 'Save',
          homepage: 'Welcome to the official CCM19 integration application. To use it you need the code snippet from the CCM19 backend. Don\'t have one? Then register now at:',
          errorMessage: "The code snippet is incorrect, please correct your input or contact support.",
          successMessage: "The code snippet has been successfully integrated.",
          emptyInputMessage: "Empty input. Code-Snippet removed.",
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
