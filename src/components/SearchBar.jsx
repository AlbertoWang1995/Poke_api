import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('allPokemon');
    if (stored) {
      setAllPokemon(JSON.parse(stored));
      return;
    }

    const fetchPokemon = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
      const data = await res.json();
      setAllPokemon(data.results);
      sessionStorage.setItem('allPokemon', JSON.stringify(data.results));
    };

    fetchPokemon();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/pokemon/${search.toLowerCase()}`);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearch(input);

    if (input.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = allPokemon.filter((poke) =>
        poke.name.includes(input)
      );
      setSuggestions(filtered.slice(0, 6));
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/pokemon/${name}`);
    setSearch('');
    setSuggestions([]);
  };

  const handleBlur = () => {
    // Esperar un poco antes de cerrar sugerencias, para permitir clic en sugerencia
    setTimeout(() => setSuggestions([]), 100);
  };

  return (
    <div
      className="search-wrapper"
      tabIndex={0}
      onBlur={() => setTimeout(() => setSuggestions([]), 100)}
    >
    <form className="search-form" onSubmit={handleSearch}>
    <input
      className="search-input"
      type="search"
      placeholder="Buscar por nombre o ID"
      onChange={handleChange}
      value={search}
      autoComplete="off"
      aria-label="Buscar Pokémon por nombre o número"
      />
    </form>
      {suggestions.length > 0 && (
       <ul className="suggestions-list">
        {suggestions.map((poke) => (
          <li key={poke.name} onClick={() => handleSuggestionClick(poke.name)}>
            {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
           </li>
        ))}
        </ul>
      )}
    </div>
  );
}
