// src/api/storeService.ts

interface StoreData {
  id?: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  type: string;
  status: string;
  revenue: number;
  orders: number;
  inventory: number;
  rating: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const getStores = async (): Promise<StoreData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) throw new Error("Failed to fetch stores");
    return await response.json();
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};

export const addStore = async (store: StoreData): Promise<StoreData> => {
  const response = await fetch(`${API_BASE_URL}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(store),
  });
  if (!response.ok) throw new Error("Failed to add store");
  return await response.json();
};

export const updateStore = async (id: number, updates: Partial<StoreData>): Promise<StoreData> => {
  const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update store");
  return await response.json();
};

export const deleteStore = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete store");
};
