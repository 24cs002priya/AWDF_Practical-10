const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export async function request(path, options = {}) {
    const token = localStorage.getItem('nextrip_token');
    const response = await fetch(`${BASE}${path}`, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
    let data;
    try {
        data = await response.json();
    }
    catch {
        throw new Error(`Invalid server response (${response.status})`);
    }
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('nextrip_token');
            window.dispatchEvent(new Event('nextrip:unauthorized'));
        }
        throw new Error(data.error || `Request failed (${response.status})`);
    }
    return data;
}
export const getCars = () => request('/cars');
export const getCar = id => request(`/cars/${id}`);
export const createCar = data => request('/cars', { method: 'POST', body: JSON.stringify(data) });
export const updateCar = (id, data) => request(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCar = id => request(`/cars/${id}`, { method: 'DELETE' });
export const register = data => request('/register', { method: 'POST', body: JSON.stringify(data) });
export const login = data => request('/login', { method: 'POST', body: JSON.stringify(data) });
export const getMe = () => request('/me');
export const generateDescription = title => request('/api/ai/generate-description', { method: 'POST', body: JSON.stringify({ title }) });
