import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import { URL_POKEMON } from '../api/apiRest';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    async function fetchPokemons() {
      const res = await fetch(`${URL_POKEMON}?offset=${offset}&limit=20`);
      const json = await res.json();
      setPokemonList(json.results);
    }
    fetchPokemons();
  }, [offset]);

  return (
    <>
      <Header />
      <section className="card-grid">
        {pokemonList.map((pkm, i) => (
          <Card key={i} card={pkm} />
        ))}
      </section>
      <div className="pagination">
        <button onClick={() => setOffset(prev => Math.max(0, prev - 20))} disabled={offset === 0}>Anterior</button>
        <button onClick={() => setOffset(offset + 20)}>Siguiente</button>
      </div>
    </>
  );
}
