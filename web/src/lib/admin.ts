const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const [dataB64] = token.split('.');
    const payload = JSON.parse(atob(dataB64));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...init?.headers },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
  }
  return res;
}

/**
 * Turn a failed admin response into a message worth showing. A bare
 * "Failed to save" hides the difference between a validation error, a broken
 * D1 binding, and an unmigrated database — all of which surface as one 500.
 */
export async function describeError(res: Response, fallback: string): Promise<string> {
  const detail = (await res.json().catch(() => null)) as { error?: string } | null;
  if (detail?.error) return detail.error;
  if (res.status >= 500) {
    return `${fallback} The server returned ${res.status}. This usually means the database is unreachable or has not been migrated.`;
  }
  return `${fallback} (${res.status})`;
}
