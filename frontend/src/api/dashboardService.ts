import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Example if backend path differs
const res = await axios.get(`${BASE_URL}/dashboard/getStats`);

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${BASE_URL}/dashboard/stats`, { withCredentials: true });
  return response.data;
};

export const fetchRecentActivity = async () => {
  const response = await axios.get(`${BASE_URL}/dashboard/recent-activity`, { withCredentials: true });
  return response.data;
};
