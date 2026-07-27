const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
}

export default API_URL;