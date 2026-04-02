import { cookies } from 'next/headers';
import { fetchUrl, FetchOptions } from './fetchUrl';

/**
 * A reusable fetch utility specifically for Next.js Server Components.
 * It automatically grabs the 'accessToken' from cookies and injects it into the headers.
 */
export async function fetchServer<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const headers = { ...options.headers } as Record<string, string>;
  
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetchUrl<T>(endpoint, { ...options, headers });
}
