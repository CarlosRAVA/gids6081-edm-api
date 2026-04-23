import api from "./api";

export const getLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.session_id) params.append("session_id", filters.session_id);
  if (filters.from)       params.append("from", filters.from);
  if (filters.to)         params.append("to", filters.to);
  if (filters.statusCode) params.append("statusCode", filters.statusCode);

  const res = await api.get(`/logs?${params.toString()}`);
  return res.data;
};