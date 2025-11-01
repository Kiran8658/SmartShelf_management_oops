import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

export const getInventory = () => axios.get(API_URL);
export const addInventoryItem = (item) => axios.post(API_URL, item);
export const updateInventoryItem = (id, item) => axios.put(`${API_URL}/${id}`, item);
export const deleteInventoryItem = (id) => axios.delete(`${API_URL}/${id}`);
export const getLowStockItems = (threshold) => axios.get(`${API_URL}/low-stock?threshold=${threshold}`);