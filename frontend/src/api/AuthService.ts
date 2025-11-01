import axios from "axios";

// Base URL for your backend auth endpoints
const API_URL = "http://localhost:8080/api/auth";

interface AuthUser {
  username: string;
  password: string;
  email?: string;
}

/**
 * Register a new user
 */
export const register = async (user: AuthUser) => {
  try {
    const response = await axios.post(`${API_URL}/register`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    // Return backend error message or generic
    throw error.response?.data?.message || "Registration failed";
  }
};

/**
 * Login an existing user
 */
export const login = async (user: AuthUser) => {
  try {
    const response = await axios.post(`${API_URL}/login`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    // Return backend error message or generic
    throw error.response?.data?.message || "Login failed";
  }
};
