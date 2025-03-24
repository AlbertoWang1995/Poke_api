import { URL_POKEMON, URL_ESPECIES, URL_EVOLUTIONS } from '../api/apiRest';

export async function fetchPokemonDataByName(name) {
  const res = await fetch(`${URL_POKEMON}/${name}`);
  if (!res.ok) throw new Error('No se pudo cargar el Pokémon');
  return await res.json();
}

export async function fetchSpeciesById(id) {
  const res = await fetch(`${URL_ESPECIES}/${id}`);
  return await res.json();
}

export async function fetchEvolutionByUrl(evoUrl) {
  const evoId = evoUrl.split("/").slice(-2, -1)[0];
  const res = await fetch(`${URL_EVOLUTIONS}/${evoId}`);
  return await res.json();
}
