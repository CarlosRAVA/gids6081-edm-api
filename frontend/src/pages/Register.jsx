import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/users";
import "./Login.css"; // reutiliza los estilos base
import "./Register.css"; // estilos extra

// Validaciones que coinciden con CreateUserDto del backend
function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "El nombre es obligatorio";
  else if (form.name.trim().length < 3) errors.name = "Mínimo 3 caracteres";
  else if (form.name.trim().length > 100) errors.name = "Máximo 100 caracteres";

  if (!form.lastname.trim()) errors.lastname = "El apellido es obligatorio";
  else if (form.lastname.trim().length < 3) errors.lastname = "Mínimo 3 caracteres";
  else if (form.lastname.trim().length > 100) errors.lastname = "Máximo 100 caracteres";

  if (!form.username.trim()) errors.username = "El usuario es obligatorio";
  else if (form.username.trim().length < 3) errors.username = "Mínimo 3 caracteres";
  else if (form.username.trim().length > 100) errors.username = "Máximo 100 caracteres";
  else if (!/^[a-zA-Z0-9._-]+$/.test(form.username.trim()))
    errors.username = "Solo letras, números, puntos, guiones y guiones bajos";

  if (!form.password) errors.password = "La contraseña es obligatoria";
  else if (form.password.length < 5) errors.password = "Mínimo 5 caracteres";
  else if (form.password.length > 16) errors.password = "Máximo 16 caracteres";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Debe tener al menos una mayúscula";
  else if (!/[0-9]/.test(form.password)) errors.password = "Debe tener al menos un número";
  else if (!/[^a-zA-Z0-9]/.test(form.password)) errors.password = "Debe tener al menos un carácter especial";

  if (!form.confirmPassword) errors.confirmPassword = "Confirma tu contraseña";
  else if (form.password !== form.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";

  return errors;
}

// Indicador visual de fuerza de contraseña
function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 5) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: score, label: "Débil", color: "#ef4444" };
  if (score <= 3) return { level: score, label: "Regular", color: "#f59e0b" };
  return { level: score, label: "Fuerte", color: "#22c55e" };
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate("/", { state: { registered: true } });
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (Array.isArray(msg)) setGeneralError(msg[0]);
      else setGeneralError(msg || "Error al registrar, intenta de nuevo");
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

      <div className="login-card register-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">⬡</span>
          </div>
          <h1 className="login-title">Crear cuenta</h1>
          <p className="login-subtitle">Únete a TaskFlow</p>
        </div>

        {generalError && (
          <div className="login-error">
            <span className="login-error-icon">!</span>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Nombre y Apellido en fila */}
          <div className="register-row">
            <div className="field-group">
              <label className="field-label" htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Juan"
                value={form.name}
                onChange={handleChange}
                className={`field-input field-input-simple ${errors.name ? "field-input-error" : ""}`}
                maxLength={100}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="lastname">Apellido</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                placeholder="Pérez"
                value={form.lastname}
                onChange={handleChange}
                className={`field-input field-input-simple ${errors.lastname ? "field-input-error" : ""}`}
                maxLength={100}
              />
              {errors.lastname && <span className="field-error">{errors.lastname}</span>}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="username">Usuario</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </span>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="juan.perez"
                value={form.username}
                onChange={handleChange}
                className={`field-input ${errors.username ? "field-input-error" : ""}`}
                maxLength={100}
                autoComplete="username"
                spellCheck={false}
              />
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Contraseña</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Mín. 5 caracteres"
                value={form.password}
                onChange={handleChange}
                className={`field-input ${errors.password ? "field-input-error" : ""}`}
                maxLength={16}
                autoComplete="new-password"
              />
            </div>
            {/* Barra de fuerza de contraseña */}
            {form.password && (
              <div className="strength-wrap">
                <div className="strength-bar">
                  {[1,2,3,4,5].map((i) => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= strength.level ? strength.color : "var(--bg4)" }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
            <ul className="password-rules">
              <li className={form.password.length >= 5 ? "rule-ok" : ""}>Mínimo 5 caracteres</li>
              <li className={/[A-Z]/.test(form.password) ? "rule-ok" : ""}>Al menos una mayúscula</li>
              <li className={/[0-9]/.test(form.password) ? "rule-ok" : ""}>Al menos un número</li>
              <li className={/[^a-zA-Z0-9]/.test(form.password) ? "rule-ok" : ""}>Al menos un carácter especial</li>
            </ul>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`field-input ${errors.confirmPassword ? "field-input-error" : ""}`}
                maxLength={16}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Crear cuenta"}
          </button>
        </form>

        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;