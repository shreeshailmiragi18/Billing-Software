import axios from "axios";

export const addUser = async (user) => {
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  // If user is a FormData instance, let axios set multipart headers
  if (user instanceof FormData) {
    return await axios.post(
      "https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/register",
      user,
      { headers },
    );
  }
  return await axios.post(
    "https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/register",
    user,
    { headers },
  );
};

export const deleteUser = async (id) => {
  return await axios.delete(
    `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/users/${id}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
  );
};

export const fetchUsers = async () => {
  return await axios.get(
    "https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/users",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    },
  );
};

export const updateUser = async (id, user) => {
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  if (user instanceof FormData) {
    return await axios.put(
      `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/users/${id}`,
      user,
      { headers },
    );
  }
  return await axios.put(
    `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/users/${id}`,
    user,
    { headers },
  );
};

export const fetchUserById = async (id) => {
  return await axios.get(
    `https://billing-software-backend-tv6i.onrender.com/api/v1.0/admin/users/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    },
  );
};
