const envUrl = import.meta.env.VITE_API_URL;
export const API_URL = (envUrl !== undefined && envUrl !== '')
  ? envUrl.replace(/\/+$/, '')
  : (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');


