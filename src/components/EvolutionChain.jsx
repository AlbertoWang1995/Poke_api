import { useEffect, useState } from 'react';

export default function EvolutionChain({ url }) {
  const [chain, setChain] = useState([]);

  useEffect(() => {
    async function fetchChain() {
      const res = await fetch(url);
      const json = await res.json();
      const out = [];
      let current = json.chain;

      while (current) {
        out.push(current.species.name);
        current = current.evolves_to[0];
      }

      setChain(out);
    }
    fetchChain();
  }, [url]);

  return (
    <div>
      <h4>Cadena Evolutiva:</h4>
      <ul>
        {chain.map((name, i) => <li key={i}>{name}</li>)}
      </ul>
    </div>
  );
}

