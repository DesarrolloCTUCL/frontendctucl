// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Error ${res.status}: ${errorBody}`);
  }

  return res.json();
}
