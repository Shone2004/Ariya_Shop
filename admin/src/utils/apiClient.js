const API_BASE_URL = "https://ariya-shop.onrender.com/api";

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle unauthorized/expired token
    if (response.status === 401) {
  console.warn("Unauthorized request or token expired.");

  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");

  window.location.href =
    "https://www.ariyashop.in/login?redirect=admin";
}

    return response;
  } catch (error) {
    console.error(`API Client Error on ${endpoint}:`, error);
    throw error;
  }
};
export default apiClient;
