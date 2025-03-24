import { useState, useEffect } from 'react';
import { fetchPokemonDataByName, fetchSpeciesById, fetchEvolutionByUrl } from '../utils/apiHelpers';
import { tipoTraducido, statTraducido } from '../utils/translate';
import './card.css';
import { habitatTraducido } from '../utils/translate';

export default function Card({ card }) {
  const [data, setData] = useState(null);
  const [especieData, setEspecieData] = useState(null);
  const [evoluciones, setEvoluciones] = useState([]);

  useEffect(() => {
    if (!card?.name) return;

    const fetchData = async () => {
      const pokeData = await fetchPokemonDataByName(card.name);
      setData(pokeData);

      const pokeId = card.url.split("/")[6];
      const especiesData = await fetchSpeciesById(pokeId);
      setEspecieData({
        url_especie: especiesData.evolution_chain?.url || null,
        data: especiesData,
      });
    };

    fetchData();
  }, [card]);

  useEffect(() => {
    if (!especieData?.url_especie) return;

    const fetchEvoluciones = async () => {
      const evoData = await fetchEvolutionByUrl(especieData.url_especie);
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
    };

    fetchEvoluciones();
  }, [especieData?.url_especie]);

  const pokeId = data?.id?.toString().padStart(3, '0');
  const nombreFormateado = data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1);
  const tipoPrincipal = data?.types?.[0]?.type?.name || 'default';
  const habitatName = especieData?.data?.habitat?.name;
  const habitatEs = habitatName ? (habitatTraducido[habitatName] || habitatName) : 'Desconocido';

  return (
    <div className={`card bg-${especieData?.data?.color?.name || "default"}`}>
      {data?.sprites && (
        <img
          className={`img_poke bg-${especieData?.data?.color?.name || "default"}`}
          src={data.sprites.other["official-artwork"].front_default || ""}
          alt={card.name || "Pokemon"}
        />
      )}

      <div className={`bg-${especieData?.data?.color?.name || "default"} sub_card`}>
        <div className="name_id_wrap">
          <strong className="id_poke">#{pokeId || "N/A"}</strong>
          <strong className="name_poke">{nombreFormateado}</strong>
        </div>

        <h4 className="altura_poke">Altura: {data?.height ? `${data.height * 10} cm` : "N/A"}</h4>
        <h4 className="peso_poke">Peso: {data?.weight ? `${data.weight / 10} kg` : "N/A"}</h4>
        <h4 className="habitat_poke">Hábitat: {habitatEs}</h4>

        <div className="div_stats">
          {data?.stats?.map((sta, index) => (
            <h6 key={index} className="item_stats">
              <span className="name">{statTraducido[sta.stat.name] || sta.stat.name}</span>
              <progress value={sta.base_stat} max={110}></progress>
              <span className="numero">{sta.base_stat}</span>
            </h6>
          ))}

          <div className="div_type_color">
            {data?.types?.map((ti, index) => (
              <h6 key={index} className={`color-${ti.type.name} color_type`}>
                {tipoTraducido[ti.type.name] || ti.type.name}
              </h6>
            ))}
          </div>
        </div>

        {evoluciones.length > 0 && (
          <div className="div_evolutions">
            <h4>Cadena Evolutiva</h4>
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
