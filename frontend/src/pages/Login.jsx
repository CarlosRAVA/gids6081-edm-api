import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      localStorage.setItem("token", data.access_token);
      onLogin(data.access_token);
      navigate("/tasks");
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-orb login-orb1" />
        <div className="login-orb login-orb2" />
        <div className="login-grid" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">⬡</span>
          </div>
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">Inicia sesión en tu workspace</p>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">Usuario</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </span>
              <input
                type="text"
                name="username"
                placeholder="tu_usuario"
                value={form.username}
                onChange={handleChange}
                className="field-input"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="field-input"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Entrar"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text2)", marginTop: "20px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "var(--accent2)", textDecoration: "none", fontWeight: 500 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;