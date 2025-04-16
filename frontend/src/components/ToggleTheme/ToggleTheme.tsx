import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import styles from "./styles.module.scss";
import { DarkThemeIcon } from "../../assets/icons/DarkThemeIcon";
import { LightThemeIcon } from "../../assets/icons/LightThemeIcon";

export const ToggleTheme: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <IconButton
      onClick={toggleTheme}
      className={styles.themeToggle}
      color="inherit"
      aria-label="toggle theme"
    >
      {isDarkMode ? <DarkThemeIcon /> : <LightThemeIcon />}
    </IconButton>
  );
};
