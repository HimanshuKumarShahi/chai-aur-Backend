const BASE_URL = "http://localhost:5000/api";

export const apiFetch = async (endpoint, method = "GET", body, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
};