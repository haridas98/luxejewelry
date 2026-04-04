// API Configuration
// In production (Docker), API is proxied through Nginx at /api/
// In development, API is at http://localhost:8000/api/

const isDev = window.location.port === '3000';
const API_BASE = isDev ? 'http://localhost:8000' : '';

export const api = (path) => `${API_BASE}${path}`;
export const apiEndpoint = api;
export const ENDPOINTS = {
  products: '/api/products/',
  categories: '/api/categories/',
  stones: '/api/stones/',
  sets: '/api/sets/',
  featured: '/api/featured-products/',
  search: '/api/search/',
  wishlist: '/api/wishlist/',
  token: '/api/token/',
  register: '/api/auth/register/',
};
