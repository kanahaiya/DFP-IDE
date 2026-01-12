/**
 * URL utility functions for encoding/decoding and fetching
 */

import type { URLFetchOptions } from '@/types';

/**
 * Encode text to base64url (URL-safe base64)
 */
export function toBase64Url(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  } catch (error) {
    console.error('Error encoding to base64url:', error);
    throw new Error('Failed to encode text');
  }
}

/**
 * Decode base64url to text
 */
export function fromBase64Url(encoded: string): string | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    console.warn('Error decoding base64url:', error);
    return null;
  }
}

/**
 * Get URL parameter safely
 */
export function getUrlParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  } catch (error) {
    console.warn(`Error getting URL param "${name}":`, error);
    return null;
  }
}

/**
 * Safely decode URL parameter (handles both base64url and regular encoding)
 */
export function safeDecodeParam(param: string): string | null {
  if (!param) return null;
  
  // Try base64url first
  const decoded = fromBase64Url(param);
  if (decoded) return decoded;
  
  // Fall back to regular URL decoding
  try {
    return decodeURIComponent(param);
  } catch (error) {
    console.warn('Error decoding param:', error);
    return null;
  }
}

/**
 * Normalize HTTP URL
 */
export function normalizeHttpUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  try {
    const parsed = new URL(trimmed, typeof window !== 'undefined' ? window.location.href : undefined);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Fetch content from URL
 */
export async function fetchFromUrl(
  url: string,
  options: URLFetchOptions = {}
): Promise<string> {
  const { timeout = 10000, headers = {} } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: '*/*',
        ...headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error('Failed to fetch from URL');
  }
}

/**
 * Create shareable URL with encoded data
 */
export function createShareUrl(
  path: string,
  paramName: string,
  data: string
): string {
  if (typeof window === 'undefined') return '';
  
  const encoded = toBase64Url(data);
  const baseUrl = `${window.location.origin}${path}`;
  return `${baseUrl}?${encodeURIComponent(paramName)}=${encoded}`;
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL is allowed (CORS-friendly)
 */
export function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Block file:// and other non-http protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    
    // Could add more security checks here (e.g., allowlist)
    return true;
  } catch {
    return false;
  }
}
