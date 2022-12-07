import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './locales/cn/translation.json';
import en from './locales/en/translation.json';
import React from "react";
import store from "store";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: en
    },
    cn: {
        translation: cn
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        // lng: "en",
        fallbackLng: ['en'],
        whitelist: ['en', 'cn'],
        detection: {
            order: ['localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            lookupLocalStorage: 'lang',
        },

        keySeparator: '::',
        nsSeparator: false,

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

i18n.on('languageChanged', (lng: string) => {
    // const path = window.location.pathname.split('/');
    // path[1] = lng
    // rootStore.historyStore.replace(path.join('/'));
    store.set('lang', lng);
})

export default i18n;
