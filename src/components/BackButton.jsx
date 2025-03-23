import { useNavigate } from 'react-router-dom';
export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/')} className="toggle-theme" style={{ top: '4rem' }}>
      Volver al inicio
    </button>
  );
}

