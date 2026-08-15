import axios from "axios";

export const addCategory = async (category) => {
  return await axios.post(
    "https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/categories",
    category,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
  );
};

export const deleteCategory = async (categoryId) => {
  return await axios.delete(
    `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/categories/${categoryId}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
  );
};

export const fetchCategories = async () => {
  return await axios.get(
    "https://billing-software-backend-tv6i.onrender.com/api/v1.0/categories",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    },
  );
};

export const updateCategory = async (categoryId, category) => {
  const token = localStorage.getItem("token");
  // For multipart/form-data, let axios set the Content-Type (including boundary).
  if (category instanceof FormData) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return await axios.put(
      `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/categories/${categoryId}`,
      category,
      { headers },
    );
  }
  // For JSON payloads
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return await axios.put(
    `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/categories/${categoryId}`,
    category,
    { headers },
  );
};
