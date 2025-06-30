import * as Localization from 'react-native-localize'
import en from './locales/en.json'
import hi from './locales/hi.json'
import ma from './locales/ma.json'
import gu from './locales/gu.json'    
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {translation:en},
    hi: {translation:hi},
    ma: {translation:ma},
    gu: {translation:gu},
}

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: callback => {
        const bestLanguage = Localization.findBestLanguageTag(
            Object.keys(resources),
        )
        callback(bestLanguage?.languageTag || 'en')
    },
    init: () => {},
    cacheUserLanguage: () => {},
}

i18next.use(languageDetector).use(initReactI18next).init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
    interpolation: {
        escapeValue: false
    }
})

export default i18next;