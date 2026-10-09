const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://10.10.7.47:3200/api/v1';

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

  const defaultHeaders: Record<string, string> = {};

  if (!(customOptions.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // For Client-Side components: Automatically attach token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
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

    const handleUnauthorized = () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Clear cookies more thoroughly
        const cookies = ['accessToken', 'refreshToken'];
        cookies.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        });

        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    };

    if (response.status === 401) {
      handleUnauthorized();
    }

    if (!response.ok) {
      // Try to parse JSON error message if provided by backend
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || `API error: ${response.status} ${response.statusText}`;

      // Check for user existence or auth error messages even if status wasn't strictly 401
      if (
        errorMessage === "User doesn't exist!" ||
        errorMessage === "You are not authorized" ||
        errorMessage?.toLowerCase?.().includes("user doesn't exist")
      ) {
        handleUnauthorized();
      }

      throw new Error(errorMessage);
    }

    // Return the parsed JSON. 
    // Handle 204 No Content or empty responses safely.
    if (response.status === 204) {
        return {} as T;
    }
    
    const data: T = await response.json();
    return data;
  } catch (error: any) {
    if (error?.message !== 'Unauthorized') {
      console.error(`[fetchUrl Error] ${options.method || 'GET'} ${url}:`, error);
    }
    throw error;
  }
}
