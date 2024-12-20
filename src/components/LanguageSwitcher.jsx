import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import enTranslation from "./../locales/en/translation.json";
import ltTranslation from "./../locales/lt/translation.json";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const translations = { en: enTranslation, lt: ltTranslation };

  return (
    <div className="language-switcher mb-4">
      <span>{translations[language]["select_language"]}: </span>
      <button
        onClick={() => toggleLanguage("en")}
        disabled={language === "en"}
        className={`px-4 py-2 ml-2 rounded ${
          language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage("lt")}
        disabled={language === "lt"}
        className={`px-4 py-2 ml-4 rounded ${
          language === "lt"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        aria-label="Switch to Lithuanian"
      >
        LT
      </button>
    </div>
  );
};

export default LanguageSwitcher;
