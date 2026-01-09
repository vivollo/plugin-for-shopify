import axios from "axios";

console.log('Vivollo API URL', {
    url: process.env.VIVOLLO_API_URL
})

const api = axios.create({
  baseURL: process.env.VIVOLLO_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed, e.g. from a global store or context if applicable
    // For server-side calls, we might not always have a user session context available globally 
    // without passing it in, but we can log requests.
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "[API Response Error]",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("[API No Response]", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("[API Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
