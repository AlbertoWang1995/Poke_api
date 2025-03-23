import { useState, useEffect } from 'react';
import { URL_POKEMON, URL_ESPECIES, URL_EVOLUTIONS } from '../api/apiRest';
import './card.css';

export default function Card({ card }) {
  const [data, setData] = useState(null);
  const [especieData, setEspecieData] = useState(null);
  const [evoluciones, setEvoluciones] = useState([]);

  const tipoTraducido = {
    normal: 'normal',
    fire: 'fuego',
    water: 'agua',
    grass: 'planta',
    electric: 'eléctrico',
    ice: 'hielo',
    fighting: 'lucha',
    poison: 'veneno',
    ground: 'tierra',
    flying: 'volador',
    psychic: 'psíquico',
    bug: 'bicho',
    rock: 'roca',
    ghost: 'fantasma',
    dark: 'siniestro',
    dragon: 'dragón',
    steel: 'acero',
    fairy: 'hada',
  };

  const statTraducido = {
    hp: 'Salud',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    speed: 'Velocidad',
  };

  useEffect(() => {
    if (!card?.name) return;

    const fetchPokemonData = async () => {
      const responsePoke = await fetch(`${URL_POKEMON}/${card.name}`);
      const pokeData = await responsePoke.json();
      setData(pokeData);

      const pokeId = card.url.split("/")[6];
      const responseEspecie = await fetch(`${URL_ESPECIES}/${pokeId}`);
      const especiesData = await responseEspecie.json();
      setEspecieData({
        url_especie: especiesData.evolution_chain?.url || null,
        data: especiesData,
      });
    };

    fetchPokemonData();
  }, [card]);

  useEffect(() => {
    if (!especieData?.url_especie) return;

    const fetchEvoluciones = async () => {
      const evoId = especieData.url_especie.split("/").slice(-2, -1)[0];
      const responseEvo = await fetch(`${URL_EVOLUTIONS}/${evoId}`);
      const evoData = await responseEvo.json();

      const getEvolucionChain = async (chain) => {
        const evolucionesArray = [];
        let current = chain;
        while (current) {
          const responsePoke = await fetch(`${URL_POKEMON}/${current.species.name}`);
          const pokeData = await responsePoke.json();
          evolucionesArray.push({
            name: current.species.name,
            sprite: pokeData.sprites.other["official-artwork"].front_default || "",
          });
          current = current.evolves_to[0] || null;
        }
        setEvoluciones(evolucionesArray);
      };

      getEvolucionChain(evoData.chain);
    };

    fetchEvoluciones();
  }, [especieData?.url_especie]);

  const pokeId = data?.id?.toString().padStart(3, "0");
  const nombreFormateado = data?.name
    ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
    : "Desconocido";
  const habitatEs = especieData?.data?.habitat?.name
    ? especieData.data.habitat.name === 'rare'
      ? 'raro'
      : especieData.data.habitat.name.charAt(0).toUpperCase() +
        especieData.data.habitat.name.slice(1)
    : 'Desconocido';

  return (
    <div className={`card bg-${especieData?.data?.color?.name || "default"}`}>
      {data?.sprites && (
        <div className="img_poke_container">
          <img
            className={`img_poke bg-${especieData?.data?.color?.name || "default"}`}
            src={data.sprites.other["official-artwork"].front_default || ""}
            alt={card.name || "Pokemon"}
          />
        </div>
      )}

      <div className={`bg-${especieData?.data?.color?.name || "default"} sub_card`}>
        <div className="name_id_wrap">
          <strong className="id_poke dark-mode-aware ">#{pokeId || "N/A"}</strong>
          <strong className="name_poke text-shadow">{nombreFormateado}</strong>
        </div>

        <h4 className="altura_poke">
          Altura: {data?.height ? `${data.height * 10} cm` : "N/A"}
        </h4>
        <h4 className="peso_poke">
          Peso: {data?.weight ? `${data.weight / 10} kg` : "N/A"}
        </h4>
        <h4 className="habitat_poke">Hábitat: {habitatEs}</h4>

        <div className="div_stats text-shadow">
          {data?.stats?.map((sta, index) => (
            <h6 key={index} className="item_stats">
              <span className="name">{statTraducido[sta.stat.name] || sta.stat.name}</span>
              <progress value={sta.base_stat} max={110}></progress>
              <span className="numero">{sta.base_stat}</span>
            </h6>
          ))}

          <div className="div_type_color">
            {data?.types?.map((ti, index) => (
              <h6 key={index} className={`color-${ti.type.name} color_type text-shadow`}>
                {tipoTraducido[ti.type.name] || ti.type.name}
              </h6>
            ))}
          </div>
        </div>

        {evoluciones.length > 0 && (
          <div className="div_evolutions">
            <h4 className='text-shadow'>Cadena Evolutiva</h4>
            <div className="evo_chain">
              {evoluciones.map((evo, index) => (
                <div key={index} className="evo_item">
                  <img src={evo.sprite} alt={evo.name} />
                  <h6>{evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</h6>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
