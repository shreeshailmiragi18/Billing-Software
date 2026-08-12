import axios from "axios";

export const addItem = async (item) => {
  return await axios.post("http://localhost:8080/api/v1.0/admin/items", item, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (itemId) => {
  return await axios.delete(
    `http://localhost:8080/api/v1.0/admin/items/${itemId}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
};

export const fetchItems = async () => {
  return await axios.get("http://localhost:8080/api/v1.0/items", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateItem = async (itemId, item) => {
  const token = localStorage.getItem("token");
  if (item instanceof FormData) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return await axios.put(
      `http://localhost:8080/api/v1.0/admin/items/${itemId}`,
      item,
      { headers }
    );
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return await axios.put(
    `http://localhost:8080/api/v1.0/admin/items/${itemId}`,
    item,
    { headers }
  );
};
