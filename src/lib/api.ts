const API_URL = "http://80.225.194.38:5001/api";

export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("vault_token") || "";
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "API error");
  return data;
}
