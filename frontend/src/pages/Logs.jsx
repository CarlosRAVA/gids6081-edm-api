import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogs } from "../api/logs";
import "./Logs.css";

// Determina severidad según statusCode
function getSeverity(statusCode) {
  if (statusCode >= 500) return { label: "Error",    className: "sev-error"   };
  if (statusCode >= 400) return { label: "Advertencia", className: "sev-warn" };
  if (statusCode >= 200) return { label: "Info",     className: "sev-info"    };
  return                        { label: "Desconocido", className: "sev-unknown" };
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("es-MX", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function Logs({ onLogout }) {
  const navigate = useNavigate();

  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Filtros
  const [filters, setFilters] = useState({
    session_id:  "",
    from:        "",
    to:          "",
    statusCode:  "",
  });

  const loadLogs = async (activeFilters) => {
    setLoading(true);
    setError("");
    try {
      const data = await getLogs(activeFilters);
      setLogs(data);
    } catch {
      setError("Error al cargar los logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs({}); }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Solo manda los filtros que tienen valor
    const active = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "")
    );
    loadLogs(active);
  };

  const handleClear = () => {
    setFilters({ session_id: "", from: "", to: "", statusCode: "" });
    loadLogs({});
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="tasks-root">
      {/* Sidebar — mismo que Tasks */}
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
          <button className="nav-item active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Auditoría
          </button>
          <button className="nav-item" onClick={() => navigate("/profile")}>
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
            <h1 className="tasks-title">Auditoría</h1>
            <p className="tasks-sub">{logs.length} registros encontrados</p>
          </div>
        </header>

        {/* Filtros */}
        <form className="logs-filters" onSubmit={handleSearch}>
          <div className="filter-field">
            <label className="field-label">Usuario (ID)</label>
            <input
              type="number"
              name="session_id"
              placeholder="Ej: 1"
              value={filters.session_id}
              onChange={handleFilterChange}
              className="modal-input"
              min="1"
            />
          </div>

          <div className="filter-field">
            <label className="field-label">Desde</label>
            <input
              type="datetime-local"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="modal-input"
            />
          </div>

          <div className="filter-field">
            <label className="field-label">Hasta</label>
            <input
              type="datetime-local"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="modal-input"
            />
          </div>

          <div className="filter-field">
            <label className="field-label">Severidad</label>
            <select
              name="statusCode"
              value={filters.statusCode}
              onChange={handleFilterChange}
              className="modal-input"
            >
              <option value="">Todas</option>
              <option value="200">Info (2xx)</option>
              <option value="400">Advertencia (4xx)</option>
              <option value="401">No autorizado (401)</option>
              <option value="403">Prohibido (403)</option>
              <option value="404">No encontrado (404)</option>
              <option value="500">Error (5xx)</option>
            </select>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn-save">Buscar</button>
            <button type="button" className="btn-cancel" onClick={handleClear}>Limpiar</button>
          </div>
        </form>

        {/* Tabla de logs */}
        {error && <div className="modal-error" style={{ marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div className="tasks-loading">
            {[1,2,3,4,5].map(i => <div key={i} className="task-skeleton" style={{ height: 48 }} />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="tasks-empty">
            <div className="empty-icon">◫</div>
            <p className="empty-title">Sin registros</p>
            <p className="empty-sub">No hay logs con los filtros aplicados</p>
          </div>
        ) : (
          <div className="logs-table-wrap">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Severidad</th>
                  <th>Código</th>
                  <th>Ruta</th>
                  <th>Error</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const sev = getSeverity(log.statusCode);
                  return (
                    <tr key={log.id}>
                      <td>
                        <span className={`sev-badge ${sev.className}`}>{sev.label}</span>
                      </td>
                      <td className="log-code">{log.statusCode}</td>
                      <td className="log-path">{log.path}</td>
                      <td className="log-error">{log.error || "—"}</td>
                      <td className="log-user">
                        {log.user
                          ? `${log.user.name} ${log.user.lastname} (#${log.user.id})`
                          : log.session_id ? `#${log.session_id}` : "—"
                        }
                      </td>
                      <td className="log-date">{formatDate(log.timestamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Logs;