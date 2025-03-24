import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPokemonDataByName, fetchSpeciesById, fetchEvolutionByUrl } from '../utils/apiHelpers';
import { tipoTraducido, statTraducido, habitatTraducido } from '../utils/translate';
import psyduck from '../assets/psyduck.jpg';
import '../components/card.css';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [evoluciones, setEvoluciones] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poke = await fetchPokemonDataByName(id);
        setData(poke);

        const especieData = await fetchSpeciesById(poke.id);
        setEspecie(especieData);

        const evoUrl = especieData.evolution_chain?.url;
        if (evoUrl) {
          const evoData = await fetchEvolutionByUrl(evoUrl);
          const evolucionesArray = [];
          let current = evoData.chain;

          while (current) {
            const evoPoke = await fetchPokemonDataByName(current.species.name);
            evolucionesArray.push({
              name: current.species.name,
              sprite: evoPoke.sprites.other['official-artwork'].front_default || '',
            });
            current = current.evolves_to[0] || null;
          }

          setEvoluciones(evolucionesArray);
        }

      } catch (e) {
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <img
          src={psyduck}
          alt="No encontrado"
          style={{
            width: '200px',
            maxWidth: '100%',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        />
        <h2>¡Ups! Pokémon no encontrado.</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ← Volver al inicio
        </button>
      </main>
    );
  }

  if (!data || !especie) return <p style={{ textAlign: 'center' }}>Cargando...</p>;

  const bgColor = `bg-${especie.color?.name || 'white'}`;
  const pokeId = data.id.toString().padStart(3, '0');
  const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);

  const habitatKey = especie.habitat?.name;
  const habitat = habitatKey ? (habitatTraducido[habitatKey] || habitatKey) : 'Desconocido';

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <div className={`card ${bgColor}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="img_poke_container" style={{ paddingTop: '1.5rem' }}>
          <img
            className={`img_poke ${bgColor}`}
            style={{ width: '200px' }}
            src={data.sprites.other['official-artwork'].front_default}
            alt={data.name}
          />
        </div>

        <div className={`sub_card ${bgColor}`}>
          <div className="name_id_wrap">
            <strong className="id_poke dark-mode-aware">#{pokeId}</strong>
            <strong className="name_poke">{nombre}</strong>
          </div>

          <h4 className="altura_poke">Altura: {data.height * 10} cm</h4>
          <h4 className="peso_poke">Peso: {data.weight / 10} kg</h4>
          <h4 className="habitat_poke">Hábitat: {habitat}</h4>

          <div className="div_stats">
            {data.stats.map((stat, i) => (
              <div key={i} className="item_stats">
                <span className="name">{statTraducido[stat.stat.name] || stat.stat.name}</span>
                <progress value={stat.base_stat} max={110}></progress>
                <span className="numero">{stat.base_stat}</span>
              </div>
            ))}

            <div className="div_type_color">
              {data.types.map((t, i) => (
                <span key={i} className={`color-${t.type.name} color_type`}>
                  {tipoTraducido[t.type.name] || t.type.name}
                </span>
              ))}
            </div>
          </div>

          {evoluciones.length > 0 && (
            <div className="div_evolutions">
              <h4>Cadena Evolutiva</h4>
              <div className="evo_chain">
                {evoluciones.map((evo, index) => (
                  <div
                    key={index}
                    className="evo_item"
                    onClick={() => navigate(`/pokemon/${evo.name}`)}
                    style={{ cursor: 'pointer' }}
                    title={`Ver detalle de ${evo.name}`}
                  >
                    <img
                      className="evo-sprite"
                      src={evo.sprite}
                      alt={evo.name}
                    />
                    <h6>{evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</h6>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        ← Volver al inicio
      </button>
    </main>
  );
}
