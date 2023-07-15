const translations = {
  en: require('./en.json'),
  fr: require('./fr.json'),
  // Add more language files as needed
}

const defaultLanguage = 'en'

const translate = (key, lang) => {
  const language = lang || defaultLanguage
  const translation = translations[language] || translations[defaultLanguage]
  return translation[key] || key
}

export default translate
