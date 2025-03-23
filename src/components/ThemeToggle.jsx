export default function ThemeToggle({ isDark, setIsDark }) {
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      className="toggle-theme"
      onClick={toggleTheme}
      onMouseDown={(e) => e.preventDefault()} // evita doble click en algunos navegadores
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}