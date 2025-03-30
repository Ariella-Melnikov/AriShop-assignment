// src/services/httpService.ts
import { getOrCreateCartToken } from '@arishop/shared'

const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : '/api'

// Helper for error handling
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        });
        throw new Error(errorText);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
}

// Helper to include headers
const withHeaders = (headers: HeadersInit = {}) => {
    const cartToken = getOrCreateCartToken();
    console.log('Using cart token:', cartToken); // Debug log
    
    return {
        'Content-Type': 'application/json',
        'cart-token': cartToken,
        ...headers,
    }
}

interface HttpOptions {
    headers?: HeadersInit;
    timeout?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds

const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number }) => {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

const retryRequest = async (
    fn: () => Promise<Response>, 
    retries = 3, 
    delay = 1000
): Promise<Response> => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        
        console.log(`Request failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return retryRequest(fn, retries - 1, delay * 2);
    }
}

const validateRequest = (url: string, body?: unknown) => {
    if (!url) {
        throw new Error('URL is required');
    }
    
    if (body !== undefined && body !== null) {
        try {
            JSON.stringify(body);
        } catch (error) {
            throw new Error('Invalid request body - must be JSON serializable');
        }
    }
}

export const http = {
    get: async <T>(url: string, options: HttpOptions = {}): Promise<T> => {
        const response = await fetchWithTimeout(`${baseUrl}${url}`, {
            method: 'GET',
            headers: withHeaders(options.headers),
            timeout: options.timeout,
        });
        return handleResponse(response);
    },

    post: async <T>(url: string, body: unknown, options: HttpOptions = {}): Promise<T> => {
        validateRequest(url, body);
        const response = await retryRequest(
            () => fetchWithTimeout(`${baseUrl}${url}`, {
                method: 'POST',
                headers: withHeaders(options.headers),
                body: JSON.stringify(body),
                timeout: options.timeout,
            })
        );
        return handleResponse(response);
    },

    put: async (url: string, body: any) => {
        console.log('PUT Request:', `${baseUrl}${url}`, 'Body:', body);
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'PUT',
            headers: withHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (url: string) => {
        console.log('DELETE Request:', `${baseUrl}${url}`);
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'DELETE',
            headers: withHeaders(),
        });
        return handleResponse(response);
    }
}
