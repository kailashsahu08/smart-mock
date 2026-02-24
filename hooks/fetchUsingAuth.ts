import { useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';

/* Paths that NEVER get an Authorization header */
const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register'];

type RequestBody = Record<string, unknown> | unknown[] | null;

interface FetchOptions {
    body?: RequestBody;
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

interface FetchUsingAuth {
    get: (url: string, options?: Omit<FetchOptions, 'body'>) => Promise<Response>;
    post: (url: string, body?: RequestBody, options?: FetchOptions) => Promise<Response>;
    put: (url: string, body?: RequestBody, options?: FetchOptions) => Promise<Response>;
    patch: (url: string, body?: RequestBody, options?: FetchOptions) => Promise<Response>;
    delete: (url: string, options?: Omit<FetchOptions, 'body'>) => Promise<Response>;
}

/**
 * useFetchUsingAuth
 *
 * A hook that returns a set of fetch helpers (get/post/put/patch/delete).
 * Every request automatically attaches `Authorization: Bearer <token>`
 * from AuthContext *except* for login and register endpoints.
 *
 * Usage:
 *   const { get, post, put, patch, delete: del } = useFetchUsingAuth();
 *   const data = await get('/api/exams').then(r => r.json());
 *   const res  = await post('/api/questions', { question, options, ... });
 */
export function useFetchUsingAuth(): FetchUsingAuth {
    const { token } = useAuth();

    /** Builds the Authorization header if the URL is not public */
    const buildHeaders = useCallback(
        (url: string, skipAuth = false, extra: Record<string, string> = {}): HeadersInit => {
            const isPublic = PUBLIC_PATHS.some((p) => url.startsWith(p)) || skipAuth;
            return {
                'Content-Type': 'application/json',
                ...extra,
                ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
            };
        },
        [token]
    );

    /** Core request helper */
    const request = useCallback(
        (method: string, url: string, body?: RequestBody, options: FetchOptions = {}): Promise<Response> => {
            const { skipAuth = false, headers: extraHeaders = {} } = options;
            const init: RequestInit = {
                method,
                headers: buildHeaders(url, skipAuth, extraHeaders),
                ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
            };
            return fetch(url, init);
        },
        [buildHeaders]
    );

    return {
        get: (url, opts) => request('GET', url, undefined, opts),
        post: (url, body, opts) => request('POST', url, body, opts),
        put: (url, body, opts) => request('PUT', url, body, opts),
        patch: (url, body, opts) => request('PATCH', url, body, opts),
        delete: (url, opts) => request('DELETE', url, undefined, opts),
    };
}
