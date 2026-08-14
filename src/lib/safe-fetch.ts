/**
 * Helper to safely fetch JSON from APIs without throwing SyntaxError when
 * the server returns non-JSON content like "Rate exceeded." or HTML error pages.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  fallbackValue: T = [] as any
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.warn(`[safeFetchJson] HTTP ${res.status} from ${url}`);
      return fallbackValue;
    }
    const text = await res.text();
    if (!text || !text.trim()) {
      return fallbackValue;
    }
    try {
      return JSON.parse(text) as T;
    } catch (parseErr) {
      console.warn(`[safeFetchJson] Non-JSON response from ${url}:`, text.slice(0, 100));
      return fallbackValue;
    }
  } catch (err) {
    console.warn(`[safeFetchJson] Network error for ${url}:`, err);
    return fallbackValue;
  }
}
