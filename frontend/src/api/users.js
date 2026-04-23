import api from "./api";

export const registerUser = async (data) => {
  const res = await api.post("/user", data);
  return res.data;
};