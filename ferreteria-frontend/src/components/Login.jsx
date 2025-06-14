import React, { useState } from 'react';
import { setToken } from '../auth'; // el archivo auth.js que mencionamos antes
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      setToken(data.access); // guardás el token
      navigate('/panel'); // redirigís al panel principal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" onChange={handleChange} placeholder="Usuario" required />
        <input type="password" name="password" onChange={handleChange} placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;