import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import { URL_POKEMON } from '../api/apiRest';
import './Home.css';

export default function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      const response = await fetch(`${URL_POKEMON}?limit=1300`);
      const data = await response.json();
      setPokemonList(data.results);
      setLoading(false);
    };

    fetchPokemonList();
  }, []);

  const totalPages = Math.ceil(pokemonList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePokemon = pokemonList.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <Header />

      <main>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando...</p>
        ) : (
          <>
            <div className="card-grid">
              {visiblePokemon.map((poke) => (
                <Card key={poke.name} card={poke} />
              ))}
            </div>

            {/* Paginación */}
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ⏪ Inicio
              </button>

              <button
                className="page-button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ⏮ Anterior
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`page-button ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                className="page-button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente ⏭
              </button>

              <button
                className="page-button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Último ⏩
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
