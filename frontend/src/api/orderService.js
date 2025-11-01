import axios from "axios";

// ✅ Configure backend base URL correctly
// If .env file has VITE_API_URL, it will use that (example: http://localhost:8080/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ✅ Create a reusable axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ✅ Get all orders
export const getOrders = async () => {
  try {
    const response = await API.get("/orders");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw error;
  }
};

// ✅ Add a new order
export const addOrder = async (order) => {
  try {
    const response = await API.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding order:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete order by ID (now with return + error clarity)
export const deleteOrder = async (id) => {
  try {
    const response = await API.delete(`/orders/${id}`);
    console.log("✅ Deleted order:", id);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting order:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to delete order");
  }
};

export default {
  getOrders,
  addOrder,
  deleteOrder,
};
