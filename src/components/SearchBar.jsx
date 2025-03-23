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
      setSuggestions([]); // ocultar sugerencias
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
      setSuggestions(filtered.slice(0, 6)); // máx. 6 sugerencias
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/pokemon/${name}`);
    setSearch('');
    setSuggestions([]);
  };

  return (
    <div className="search-wrapper">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="search"
          placeholder="Buscar por nombre o ID"
          onChange={handleChange}
          value={search}
          autoComplete="off"
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
