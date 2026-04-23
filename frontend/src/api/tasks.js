import api from "./api";

export const getTasks = async () => {
  const res = await api.get("/task");
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post("/task", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await api.put(`/task/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/task/${id}`);
  return res.data;
};