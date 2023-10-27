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
      billing: {
        options: {
          label: "Verfügbare Buchungsintervalle",
          monthly: "Monatlich",
          yearly: "Jährlich",
          priceLabel:"monatlich inkl. 19% USt",
          price: "Preis",
          title:"Verfügbare Tarife"
        },
        starter: {
          title: "Starter",
          submit: "Jetzt buchen",
          listText: "Enthält alle Standard Features\n" +
              "und ",
          features: {
            feature0: "Alle Daten in Deutschland, keine US-Anbieter.",
            feature1: "2 Domains inklusive.",
            feature2: "20.000 Impressions pro Monat inklusive.",
            feature3: "TTDSG-, DSGVO-, CCPA-, BDSG-, LGPD-, POPIA-konform.",
            feature4: "Eigenes Logo möglich.",
            feature5: "Gleittarife aktivierbar in der Cloud.",
            feature6: "Eigene Sprachen möglich.",
            feature7: "IFrame-Blockierung (z.B. Youtube, Google Maps).",
            feature8: "Multi-Domain-Unterstützung.",
            feature9: "Alle Standardfunktionen.",
            feature10: "Standard-Support per E-Mail.",
            feature11: "SLA 99,5%."
          },
        },
        business: {
          title: "Business",
          submit: "Jetzt buchen",
          listText: "Enthält alle Standard Features\n" +
              "plus Starter und ",
          selectTier: "Mehr Traffic oder Domains auswählen",
          tierOne:"5 Domains / 100.000 Impressions inkl.",
          tierTwo:"10 Domains / 250.000 Impressions inkl.",
          tierThree:"20 Domains / 1.000.000 Impressions inkl.",
          tierFour:"50 Domains / 2.500.000 Impressions inkl.",
          tierFive:"100 Domains / 5.000.000 Impressions inkl.",

          features: {
            feature0: "100,000 Impressions / Monat inklusive.",
            feature1: "Alle Daten in Deutschland, keine US-Anbieter.",
            feature2: "Integrationsdienst kann zum Warenkorb hinzugefügt werden.",
            feature3: "TTDSG-, DSGVO-, CCPA-, BDSG-, LGPD-, POPIA-konform.",
            feature4: "Beliebige Anzahl von Benutzern",
            feature5: "Gruppen- und Rechteverwaltung",
            feature6: "24+ Sprachen",
            feature7: "Individuelles CSS für Widgets und Iframes",
            feature8: "Analyse - Grafische Analyse von Inhaltsdaten, aufgeschlüsselt nach verschiedenen Faktoren wie Browser, Betriebssystem, etc.",
            feature9: "A/B-Tests inklusive",
            feature10: "Aktivieren und Verwalten einzelner Skripte",
            feature11: "Zustimmungsfreigabe über (Sub)domains",
            feature12: "TCF 2.0 / IAB-Funktionen können als zusätzliches Modul aktiviert werden",
            feature13: "Alle Standardfunktionen",
            feature14: "Priorisierter Support per E-Mail und Telefon",
            feature15: "SLA 99,5%"
          }


        },
        standardFeatures: {
          title: "Alle Tarife enthalten die folgenden Features:",
          //dank geht raus an chatgpt für das tippen der ganzen liste
          features: {
            feature0: "Konform mit BGH-Urteil vom 28.05.2020",
            feature1: "Vorlagen für hunderte der wichtigsten Cookies von Google Ads, Analytics, Facebook, Matomo uvm.",
            feature2: "TTDSG konform, DSGVO konform",
            feature3: "Individuelle Texte ausgeben lassen",
            feature4: "Mehrsprachige Admin-Oberfläche und Frontend",
            feature5: "NoLabelfähig",
            feature6: "Integrierte Geolokalisierung – Cookies nur für Besucher aus EU",
            feature7: "Cookie Box einfach gestalten",
            feature8: "Reload der Website nicht notwendig",
            feature9: "Widget nicht anzeigen bei Impressum/Datenschutzseiten",
            feature10: "Frei bestimmbarer Zeitpunkt für Zwangsreset des Cookie Consents buchbar",
            feature11: "Vorlage und Anleitung für Google TagManager",
            feature12: "Ausschluss von URLs von bestimmten Cookies/Skripten",
            feature13: "Beliebigen JS Code einbinden und Einwilligung dazu einholen",
            feature14: "Erfüllt Anforderungen an Barrierefreiheit wie Sperrung des Fokus, Kontrastverhältnisse optimieren, optimiertes HTML uvm.",
            feature15: "Erkennung von JS Einblendung (z. B. Youtube, Vimeo)",
            feature16: "Individuelle Laufzeit der Cookies möglich",
            feature17: "Do-not-Track Support",
            feature18: "Permanenter Cookie- und Skripte-Scanner mit Logfunktion",
            feature19: "Übernahme erkannter Cookies",
            feature20: "Automatische Datenschutzerklärung für Cookies für Integration in Datenschutzseite",
            feature21: "Neue Cookies können über Cookie Datenbank autom. vorbelegt werden",
            feature22: "Export aller Consent Daten möglich",
            feature23: "API für Datenabfrage",
            feature24: "Läuft unter Apache/NGINX in der Downloadversion ab Starter Tarif",
            feature25: "Frontend Maske (de)aktivierbar",
            feature26: "Diverse Ein-/Ausblendeoptionen",
            feature27: "Integration via JS-Code Snippets in jede(s) Site/System",
            feature28: "CMS/Shopsystem unabhängig",
            feature29: "Volle Datenkontrolle, da quelloffen und auf eigenem Server möglich ab Startertarif",
            feature30: "Einwilligung nach Cookiegruppen",
            feature31: "Erkennung fremder Cookies",
            feature32: "Automatische Löschung fremder First-Party Cookies möglich",
            feature33: "Erkennung nicht kontrollierter Einbindung von Javascript",
            feature34: "Automatische Updates",
            feature35: "E-Mail an Betreiber bei Updates inkl. Changelog",
            feature36: "Nutzung von Platzhaltern",
            feature37: "Automatische Einblendung von Verwaltungs-Icons",
            feature38: "Google Consent Mode",
            feature39: "Google Additional Consent Mode",
            feature40: "Geo Targeting der Consent Maske z.B. nur EU",
            feature41: "Tag Manager Funktionalität"
          },

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
          homepage: 'Welcome to the official CCM19 integration application. To use it you need the code snippet from the CCM19 backend. Don\'t have one? Then register now at:',
          errorMessage: "The code snippet is incorrect, please correct your input or contact support.",
          successMessage: "The code snippet has been successfully integrated.",
          emptyInputMessage: "Empty input. Code-Snippet removed.",
          internalErrorMessage: "Internal error. Please contact support.",
        },
      },
      billing: {
        //Todo übersetzen
        standardFeatures: {
          title: "All tarifs include the following features:",
          features: {
            feature0: "Compliant with BGH ruling of May 28, 2020",
            feature1: "Templates for hundreds of the most important cookies from Google Ads, Analytics, Facebook, Matomo, and more",
            feature2: "TTDSG compliant, GDPR compliant",
            feature3: "Customizable text output",
            feature4: "Multilingual admin interface and frontend",
            feature5: "NoLabel capable",
            feature6: "Integrated geolocation – cookies only for visitors from the EU",
            feature7: "Easily design the cookie box",
            feature8: "No need to reload the website",
            feature9: "Do not display widget on imprint/privacy pages",
            feature10: "Freely selectable time for mandatory cookie consent reset",
            feature11: "Template and instructions for Google Tag Manager",
            feature12: "Exclusion of URLs from certain cookies/scripts",
            feature13: "Integrate any JS code and obtain consent for it",
            feature14: "Meets accessibility requirements such as focus locking, optimizing contrast ratios, optimized HTML, and more",
            feature15: "Detection of JS overlays (e.g., YouTube, Vimeo)",
            feature16: "Customizable cookie lifetimes",
            feature17: "Do-not-Track support",
            feature18: "Permanent cookie and script scanner with logging function",
            feature19: "Adoption of detected cookies",
            feature20: "Automatic privacy policy for cookies for integration into the privacy page",
            feature21: "New cookies can be automatically preloaded via the cookie database",
            feature22: "Export of all consent data possible",
            feature23: "API for data retrieval",
            feature24: "Runs on Apache/NGINX in the download version starting from the Starter tariff",
            feature25: "Frontend mask (de)activatable",
            feature26: "Various show/hide options",
            feature27: "Integration via JS code snippets into any site/system",
            feature28: "Independent of CMS/shopping systems",
            feature29: "Full data control, as it is open source and can run on your own server starting from the Starter tariff",
            feature30: "Consent by cookie groups",
            feature31: "Detection of third-party cookies",
            feature32: "Automatic deletion of foreign first-party cookies possible",
            feature33: "Detection of uncontrolled JavaScript inclusion",
            feature34: "Automatic updates",
            feature35: "Email to operator with updates including changelog",
            feature36: "Use of placeholders",
            feature37: "Automatic display of management icons",
            feature38: "Google Consent Mode",
            feature39: "Google Additional Consent Mode",
            feature40: "Geo-targeting of the consent mask, e.g., only EU",
            feature41: "Tag Manager functionality"
          }
        }
      }
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
