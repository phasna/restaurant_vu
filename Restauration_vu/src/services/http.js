/**
 * Client HTTP partagé. Les stores importent ce module, pas les composants presentation.
 * En dev, Vite proxy `/api` → backend (voir vite.config.js).
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "/api" : "");

function parseBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * @param {string} path - ex. `/restaurants`
 * @param {{ method?: string, body?: unknown, headers?: Record<string, string> }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const url = `${API_BASE_URL}${path}`;
  const init = {
    method,
    headers: { ...headers },
  };
  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const text = await res.text();
  const data = parseBody(text);

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.message) ||
      text ||
      res.statusText ||
      "Erreur réseau";
    const err = new Error(String(msg));
    err.status = res.status;
    if (data && typeof data === "object" && "field" in data) {
      err.field = data.field;
    }
    err.payload = data;
    throw err;
  }

  return data;
}

export function apiGet(path) {
  return apiRequest(path, { method: "GET" });
}
