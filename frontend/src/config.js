const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  authUrl: import.meta.env.VITE_AUTH_URL || 'http://localhost:3003'
};

export default config;
