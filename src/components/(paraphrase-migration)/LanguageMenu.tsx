"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import LanguageMenus from "../tools/common/LanguageMenus";

const LanguageMenu = ({ language, setLanguage, isLoading }) => {
  const [languageTabs, setLanguageTabs] = useState([
    "English (US)",
    "French",
    "Spanish",
    "German",
    "Bangla",
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useResponsive("down", "lg");
  const maxTabs = isMobile ? 3 : 5;
  const showMenu = Boolean(anchorEl);

  const handleOpen = (e: any) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value: any) => {
    // promote selected to front, keep maxTabs
    setLanguageTabs((prev) => {
      const filtered = prev.filter((l) => l !== value);
      return [value, ...filtered].slice(0, maxTabs);
    });
    setLanguage(value);
    handleClose();
  };

  // desktop: what you had before
  const displayTabs = languageTabs.includes(language)
    ? languageTabs
    : [language, ...languageTabs].slice(0, maxTabs);

  if (isMobile) {
    // mobile: single button
    return (
      <>
        <button
          onClick={handleOpen}
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-start gap-2 rounded px-2 py-2 text-sm font-medium text-gray-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <div>
            <span className="flex-1 text-left">{language}</span>

            {showMenu ? (
              <ChevronUp className="inline h-4 w-4" />
            ) : (
              <ChevronDown className="inline h-4 w-4" />
            )}
          </div>
        </button>
        <LanguageMenus
          selectedLanguage={language}
          anchorEl={anchorEl}
          open={showMenu}
          handleClose={handleClose}
          handleLanguageMenu={handleSelect}
        />
      </>
    );
  }

  return (
    <div className="flex w-fit items-center lg:w-full">
      {/* Tabs Container */}
      <div className="scrollbar-hide flex min-h-[30px] items-center overflow-x-auto">
        <div className="flex flex-nowrap">
          {displayTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setLanguage(tab)}
              disabled={isLoading}
              className={`inline-flex w-fit cursor-pointer items-center justify-center px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 lg:px-5 ${
                language === tab
                  ? // Selected state
                    "rounded-t-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  : // Non-selected state
                    "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              } `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* "All" Button */}
      <button
        onClick={handleOpen}
        disabled={isLoading}
        className="ml-2 flex cursor-pointer items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-white"
      >
        <span>All</span>
        {showMenu ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <LanguageMenus
        selectedLanguage={language}
        anchorEl={anchorEl}
        open={showMenu}
        handleClose={handleClose}
        handleLanguageMenu={handleSelect}
      />
    </div>
  );
};

export default LanguageMenu;
