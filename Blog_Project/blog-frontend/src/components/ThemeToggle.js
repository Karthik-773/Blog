import React, { useEffect, useState } from 'react';

const THEMES = ['ocean', 'emerald', 'sunset'];
const LABELS = {
  ocean: 'Ocean',
  emerald: 'Emerald',
  sunset: 'Sunset'
};

function ThemeToggle() {
  const [theme, setTheme] = useState('ocean');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'ocean';
    setTheme(saved);
    document.body.setAttribute('data-theme', saved);
  }, []);

  const handleToggleTheme = () => {
    const index = THEMES.indexOf(theme);
    const nextTheme = THEMES[(index + 1) % THEMES.length];
    setTheme(nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button type="button" className="theme-toggle" onClick={handleToggleTheme}>
      Theme: {LABELS[theme]}
    </button>
  );
}

export default ThemeToggle;
