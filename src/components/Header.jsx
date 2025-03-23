import logo from '../assets/logo.png';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import './Header.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className={`header ${isDark ? 'dark' : 'light'}`}>
      <div className="header-content">
        <img src={logo} alt="Pokedex Logo" className="logo" />
        <SearchBar />
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      </div>
    </header>
  );
}

