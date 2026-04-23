import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Register from "./pages/Register";

// Decodifica el payload del JWT sin librerías externas
function getUserIdFromToken(token) {
  try {
    const payload = token.split(".")[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return decoded.id ?? null;
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userId = token ? getUserIdFromToken(token) : null;

  return (
    <Routes>
      <Route
        path="/"
        element={!token ? <Login onLogin={setToken} /> : <Navigate to="/tasks" />}
      />
      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to="/tasks" />}
      />
      <Route
        path="/tasks"
        element={token ? <Tasks userId={userId} onLogout={() => setToken(null)} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;