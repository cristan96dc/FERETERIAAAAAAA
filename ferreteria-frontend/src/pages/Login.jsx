import React, { useState } from 'react';
import { setToken } from '../auth';
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
      setToken(data.access);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{`
        .login-container {
          max-width: 360px;
          margin: 60px auto;
          padding: 40px 30px;
          background-color: #f7f9fc;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }
        .login-title {
          margin-bottom: 24px;
          color: #333;
          font-weight: 700;
          font-size: 1.8rem;
        }
        .login-error {
          color: #d93025;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .login-input {
          padding: 12px 15px;
          font-size: 1rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          transition: border-color 0.3s ease;
        }
        .login-input:focus {
          border-color: #1976d2;
          outline: none;
        }
        .login-button {
          padding: 12px 15px;
          background-color: #1976d2;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #0f4a90;
        }
      `}</style>

      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Usuario"
            required
            className="login-input"
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="login-input"
            autoComplete="current-password"
          />
          <button type="submit" className="login-button">Ingresar</button>
        </form>
      </div>
    </>
  );
};

export default Login;