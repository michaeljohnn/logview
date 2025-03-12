import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './translations/de.json';
import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import zh from './translations/zh.json';

const instance = i18n.createInstance();

instance
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      zh: {
        translation: zh,
      },
      de: {
        translation: de,
      },
      ja: {
        translation: ja,
      },
      ko: {
        translation: ko,
      },
      es: {
        translation: es,
      },
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

  export default instance;
