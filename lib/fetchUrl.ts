const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.0.100:3200/api/v1';

export type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

/**
 * A reusable fetch utility for Next.js server-side and client-side fetching.
 * 
 * @param endpoint The API endpoint (e.g., '/subjects') or full URL.
 * @param options Next.js fetch options including method, body, cache, next.revalidate, params, etc.
 * @returns Parsed JSON response of type T.
 */
export async function fetchUrl<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customOptions } = options;

  let url = endpoint.startsWith('http') 
    ? endpoint 
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    if (queryString) {
      url += url.includes('?') ? `&${queryString}` : `?${queryString}`;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // For Client-Side components: Automatically attach token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }
  // For Server Components: You should pass `{ headers: { Authorization: `Bearer ${token}` } }` from the page
  // using `cookies()` from `next/headers` to avoid client-side bundling issues.

  const finalHeaders = { ...defaultHeaders, ...headers };

  try {
    const response = await fetch(url, {
      headers: finalHeaders,
      ...customOptions,
    });

    if (response.status === 401) {
      // Handle unauthorized errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      // Try to parse JSON error message if provided by backend
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || `API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Return the parsed JSON. 
    // Handle 204 No Content or empty responses safely.
    if (response.status === 204) {
        return {} as T;
    }
    
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`[fetchUrl Error] ${options.method || 'GET'} ${url}:`, error);
    throw error;
  }
}
