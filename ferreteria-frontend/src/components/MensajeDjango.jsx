import { useEffect, useState } from 'react';

function MensajeDjango() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/hola/')
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>{mensaje}</h2>
    </div>
  );
}

export default MensajeDjango;