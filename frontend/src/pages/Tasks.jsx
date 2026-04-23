import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/tasks";
import "./Tasks.css";

const EMPTY_FORM = { name: "", description: "", priority: false };

function Tasks({ userId, onLogout }) {
    
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.filter(t => t.user_id === userId)); //tareas del usuario logueado
    } catch {
      showToast("Error al cargar tareas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      description: task.description,
      priority: task.priority,
      user_id: task.user_id,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.description.trim()) { setError("La descripción es obligatoria"); return; }
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          name: form.name,
          description: form.description,
          priority: form.priority,
        });
        showToast("Tarea actualizada");
      } else {
        await createTask({ ...form, user_id: userId });
        showToast("Tarea creada");
      }
      closeModal();
      loadTasks();
    } catch {
      setError("Ocurrió un error, intenta de nuevo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      showToast("Tarea eliminada");
      loadTasks();
    } catch {
      showToast("Error al eliminar", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  const filtered = tasks.filter(t =>
    filter === "all" ? true : filter === "high" ? t.priority : !t.priority
  );

  const stats = {
    total: tasks.length,
    high: tasks.filter(t => t.priority).length,
    low: tasks.filter(t => !t.priority).length,
  };

  return (
    <div className="tasks-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⬡</span>
          <span className="sidebar-logo-text">TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Tareas
          </button>
        </nav>

        <div className="sidebar-stats">
          <p className="sidebar-stats-label">Resumen</p>
          <div className="stat-row"><span>Total</span><span className="stat-val">{stats.total}</span></div>
          <div className="stat-row"><span>Alta prioridad</span><span className="stat-val stat-high">{stats.high}</span></div>
          <div className="stat-row"><span>Normal</span><span className="stat-val stat-low">{stats.low}</span></div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className="tasks-main">
        <header className="tasks-header">
          <div>
            <h1 className="tasks-title">Mis tareas</h1>
            <p className="tasks-sub">{stats.total} tareas en total</p>
          </div>
          <button className="btn-new" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva tarea
          </button>
        </header>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {["all","high","low"].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Todas" : f === "high" ? "Alta prioridad" : "Normal"}
              <span className="filter-count">
                {f === "all" ? stats.total : f === "high" ? stats.high : stats.low}
              </span>
            </button>
          ))}
        </div>

        {/* Tasks grid */}
        {loading ? (
          <div className="tasks-loading">
            {[1,2,3,4,5,6].map(i => <div key={i} className="task-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="tasks-empty">
            <div className="empty-icon">◫</div>
            <p className="empty-title">Sin tareas</p>
            <p className="empty-sub">Crea tu primera tarea para empezar</p>
            <button className="btn-new" onClick={openCreate}>Crear tarea</button>
          </div>
        ) : (
          <div className="tasks-grid">
            {filtered.map((task, i) => (
              <div
                key={task.id}
                className={`task-card ${task.priority ? "task-card-high" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="task-card-top">
                  <span className={`priority-badge ${task.priority ? "priority-high" : "priority-low"}`}>
                    {task.priority ? "Alta" : "Normal"}
                  </span>
                  <span className="task-id">#{task.id}</span>
                </div>
                <h3 className="task-name">{task.name}</h3>
                <p className="task-desc">{task.description}</p>
                <div className="task-footer">
                  <span className="task-user">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    ID {task.user_id}
                  </span>
                  <div className="task-actions">
                    <button className="task-btn task-btn-edit" onClick={() => openEdit(task)} title="Editar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="task-btn task-btn-del" onClick={() => handleDelete(task.id)} title="Eliminar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingTask ? "Editar tarea" : "Nueva tarea"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {error && <div className="modal-error">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field-group">
                <label className="field-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre de la tarea"
                  value={form.name}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Descripción</label>
                <textarea
                  name="description"
                  placeholder="Describe la tarea..."
                  value={form.description}
                  onChange={handleChange}
                  className="modal-input modal-textarea"
                  rows={3}
                />
              </div>

              <label className="priority-toggle">
                <input
                  type="checkbox"
                  name="priority"
                  checked={form.priority}
                  onChange={handleChange}
                  className="toggle-input"
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
                <span className="toggle-label">Alta prioridad</span>
              </label>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <span className="btn-spinner-sm" /> : null}
                  {editingTask ? "Guardar cambios" : "Crear tarea"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Tasks;