import React, { createContext, useState, useEffect } from "react";

// Create the Context
export const LanguageContext = createContext();

// Create the Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("lt"); // Default language

  // Optional: Persist language preference using localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Update localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
  }, [language]);

  // Function to toggle language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
