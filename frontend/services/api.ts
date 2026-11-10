/**
 * Dynamic API Base URL resolution:
 * 1. Server-side in Vercel Functions: Uses BACKEND_URL injected via service binding.
 * 2. Client-side on Vercel: Uses relative '/api' which Vercel rewrites to the backend service.
 * 3. Configured environment override: Uses NEXT_PUBLIC_API_URL if set.
 * 4. Local standalone Next.js server (port 3000): Falls back to 'http://localhost:8000/api'.
 */
export function getApiBaseUrl(): string {
  // Server-side execution (Node.js runtime in Vercel functions / SSR)
  if (typeof window === 'undefined') {
    if (process.env.BACKEND_URL) {
      // Injected by Vercel service binding
      const base = process.env.BACKEND_URL.replace(/\/+$/, '');
      return `${base}/api`;
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      const base = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
      return base.endsWith('/api') ? base : `${base}/api`;
    }
    return 'http://localhost:8000/api';
  }

  // Client-side in browser
  if (process.env.NEXT_PUBLIC_API_URL) {
    const base = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  }

  // Standalone local development on port 3000 directly accessing port 8000
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost:8000/api';
  }

  // Unified routing under Vercel (or custom domain with /api rewrite)
  return '/api';
}

export function buildApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${cleanEndpoint}`;
}

export interface ApiError {
  message: string;
  status?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jansathi_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = buildApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const errJson = await res.json();
        errMsg = errJson.detail || errJson.message || errMsg;
      } catch {
        errMsg = res.statusText || errMsg;
      }
      throw new Error(errMsg);
    }

    return (await res.json()) as T;
  } catch (error: any) {
    throw new Error(error.message || 'Network error occurred. Please check backend connection.');
  }
}

export async function uploadFileRequest<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jansathi_token') : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = buildApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const errJson = await res.json();
        errMsg = errJson.detail || errJson.message || errMsg;
      } catch {
        errMsg = res.statusText || errMsg;
      }
      throw new Error(errMsg);
    }

    return (await res.json()) as T;
  } catch (error: any) {
    throw new Error(error.message || 'File upload failed. Please check backend connection.');
  }
}
