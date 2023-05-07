import type { NextPage } from "next";

import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";

type Theme = "light" | "dark";

const SettingsPage: NextPage = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleTheme() {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // save theme preference to localStorage
    setIsDarkMode(!isDarkMode);
  }

  // Load default theme preference from localStorage, if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as Theme);
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    // console.log(`body`, body);
    if (body) {
      body.classList.add(theme);
      return () => body.classList.remove(theme);
    }
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`p-6`}>
      <h1
        className={`text-2xl font-semibold text-stone-700 dark:text-stone-100`}
      >
        Settings
      </h1>
      <div className={`w-full items-center justify-between flex my-6`}>
        <button
          onClick={toggleTheme}
          className={`rounded-full w-14 h-7 transition-colors duration-500 ${
            theme === "light" ? "bg-stone-200" : "bg-stone-700"
          }`}
        >
          <div
            className={`inline-block rounded-full w-5 h-5 transform transition-transform duration-500 ${
              theme === "light" ? "translate-x-2" : "-translate-x-2"
            }`}
          >
            <MdDarkMode
              className={`h-6 w-6 mt-0.5 text-stone-800 dark:text-stone-50`}
            />
            <span className="sr-only">Toggle</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
