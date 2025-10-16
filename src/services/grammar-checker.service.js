import api from "../lib/api";

export const grammarCheck = async (payload = {}) => {
  const response = await api.post("/grammar/check", { ...payload });
  return response?.data;
};

export const fetchGrammarSections = async (payload = {}) => {
  const response = await api.get("/grammar/sections", { ...payload });
  return response?.data;
};

export const fetchGrammarSection = async (id, payload = {}) => {
  const response = await api.get(`/grammar/section/${id}`, { ...payload });
  return response?.data;
};

export const renameGrammarSection = async (id, payload = {}) => {
  const response = await api.put(`/grammar/section-rename/${id}`, {
    ...payload,
  });
  return response?.data;
};

export const deleteGrammarSection = async (id, payload = {}) => {
  const response = await api.delete(`/grammar/section-delete/${id}`, {
    ...payload,
  });
  return response?.data;
};
