import { LANGUAGES } from "../common/CustomChangeLanguage";

export const getLanguageLabel = (code) => {
  const found = LANGUAGES.find((lang) => lang.code === code);
  return found ? found.label : code.toUpperCase();
};
