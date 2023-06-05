"use client";
// components/settings/SettingsList.tsx

import { MdDarkMode } from "react-icons/md";
import { useTheme } from "next-themes";

export const SettingsList = () => {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  const buttonBgClass = theme === "light" ? "bg-stone-200" : "bg-stone-700";
  const iconWrapperTransformClass =
    theme === "light" ? "translate-x-2" : "-translate-x-2";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-700 dark:text-stone-100">
        Settings
      </h1>
      <div className="w-full items-center justify-between flex my-6">
        <button
          onClick={toggleTheme}
          className={`rounded-full w-14 h-7 transition-colors duration-500 ${buttonBgClass}`}
        >
          <div
            className={`inline-block rounded-full w-5 h-5 transform transition-transform duration-500 ${iconWrapperTransformClass}`}
          >
            <MdDarkMode className="h-6 w-6 mt-0.5 text-stone-800 dark:text-stone-50" />
            <span className="sr-only">Toggle</span>
          </div>
        </button>
      </div>
    </div>
  );
};
