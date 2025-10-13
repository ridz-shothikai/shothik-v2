import api from "../lib/api";

export const grammarCheck = async (payload = {}) => {
  const response = await api.post("/grammar-check", { ...payload });
  return response?.data;
};
