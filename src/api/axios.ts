// axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// Attach CSRF token to requests
api.interceptors.request.use((config) => {
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        console.log('[Request] Added CSRF token for:', config.url);
    }
    return config;
});

// Fetch CSRF cookie
export const getCsrfCookie = async () => {
    console.log('[CSRF] Fetching csrf-cookie…');
    return api.get('/sanctum/csrf-cookie');
};

/* --------------------------
Refresh queue setup
--------------------------- */
let isRefreshing = false;
let subscribers: ((ok: boolean) => void)[] = [];

function subscribe(cb: (ok: boolean) => void) {
    subscribers.push(cb);
}

function notifyAll(ok: boolean) {
    subscribers.forEach((cb) => cb(ok));
    subscribers = [];
}

/**
 * Response interceptor
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Already on login → do not retry
        if (window.location.pathname === '/login') {
            console.log('[Auth] On /login, skipping refresh for:', original?.url);
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !original._retry && original.url !== '/refresh') {
            original._retry = true;

            // If refresh already running → wait in queue
            if (isRefreshing) {
                console.log('[Auth] Refresh in progress, queuing request:', original.url);
                return new Promise((resolve, reject) => {
                    subscribe((ok) => {
                        if (!ok) {
                            console.log('[Auth] Queued request rejected:', original.url);
                            reject(error);
                            return;
                        }
                        console.log('[Auth] Retrying queued request after refresh:', original.url);
                        resolve(api(original));
                    });
                });
            }

            // First request to trigger refresh
            isRefreshing = true;
            console.log('[Auth] Refreshing token…');

            try {
                await getCsrfCookie();
                await api.post('/refresh');
                console.log('[Auth] ✅ Refresh successful');

                isRefreshing = false;
                notifyAll(true);

                console.log('[Auth] Retrying original request:', original.url);
                return api(original);
            } catch (refreshError) {
                console.log('[Auth] ❌ Refresh failed, redirecting to /login');
                isRefreshing = false;
                notifyAll(false);
                Cookies.remove('XSRF-TOKEN');
                Cookies.remove('laravel_session');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
