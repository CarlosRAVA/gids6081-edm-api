import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Profile.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  const initials = user
    ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "??";

  return (
    <div className="tasks-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⬡</span>
          <span className="sidebar-logo-text">TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/tasks")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Tareas
          </button>
          <button className="nav-item" onClick={() => navigate("/logs")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Auditoría
          </button>
          <button className="nav-item active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Mi perfil
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </aside>

      <main className="tasks-main">
        <header className="tasks-header">
          <div>
            <h1 className="tasks-title">Mi perfil</h1>
            <p className="tasks-sub">Información de tu cuenta</p>
          </div>
        </header>

        {loading && (
          <div className="profile-loading">
            <div className="profile-skeleton-avatar" />
            <div style={{ flex: 1 }}>
              <div className="profile-skeleton-line" style={{ width: "40%" }} />
              <div className="profile-skeleton-line" style={{ width: "25%", marginTop: 8 }} />
            </div>
          </div>
        )}

        {error && (
          <div className="modal-error" style={{ maxWidth: 640 }}>
            {error}
          </div>
        )}

        {user && !loading && (
          <div className="profile-content">
            {/* Tarjeta principal */}
            <div className="profile-card">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-avatar-glow" />
              </div>
              <div className="profile-identity">
                <h2 className="profile-name">{user.name} {user.lastname}</h2>
                <p className="profile-since">Miembro desde {formatDate(user.created_at)}</p>
              </div>
            </div>

            {/* Datos personales */}
            <div className="profile-fields">
              <h3 className="profile-section-title">Datos personales</h3>
              <div className="profile-field-grid">
                <div className="profile-field">
                  <span className="profile-field-label">Nombre</span>
                  <span className="profile-field-value">{user.name}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-field-label">Apellido</span>
                  <span className="profile-field-value">{user.lastname}</span>
                </div>
                <div className="profile-field profile-field-full">
                  <span className="profile-field-label">ID de cuenta</span>
                  <span className="profile-field-value profile-mono">#{user.id}</span>
                </div>
                <div className="profile-field profile-field-full">
                  <span className="profile-field-label">Fecha de registro</span>
                  <span className="profile-field-value">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="profile-security">
              <h3 className="profile-section-title">Seguridad</h3>
              <div className="security-row">
                <div className="security-item">
                  <span className="security-dot security-dot-ok" />
                  <div>
                    <p className="security-label">Sesión activa</p>
                    <p className="security-sub">Token JWT válido con expiración de 1 hora</p>
                  </div>
                </div>
                <div className="security-item">
                  <span className="security-dot security-dot-ok" />
                  <div>
                    <p className="security-label">Contraseña cifrada</p>
                    <p className="security-sub">Almacenada con bcrypt — nunca en texto plano</p>
                  </div>
                </div>
                <div className="security-item">
                  <span className="security-dot security-dot-ok" />
                  <div>
                    <p className="security-label">Datos protegidos</p>
                    <p className="security-sub">Contraseña y hash excluidos de las respuestas de la API</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;