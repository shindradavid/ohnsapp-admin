import axios from 'axios';

import { API_BASE_URL, SESSION_ID_KEY } from './constants';
import { getStorageItem } from './utils';
import { APIError } from './errors';

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(
  async (request) => {
    const sessionId = await getStorageItem(SESSION_ID_KEY);

    if (sessionId) {
      request.headers['x-session-id'] = sessionId;
    }

    console.log(`REQUEST (v1): ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);

    return request;
  },
  (error) => {
    Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`RESPONSE (v1): ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    let apiError: APIError;

    if (error.response) {
      // Server responded with an error
      const status = error.response.status;
      const message = error.response.data?.message || 'Something went wrong';
      const details = error.response.data || null;
      apiError = new APIError(message, status, details);
    } else if (error.request) {
      // No response from server
      apiError = new APIError('No response from server. Please try again.', null, null);
    } else {
      // Something else went wrong
      apiError = new APIError(error.message, null, null);
    }

    console.error(
      'API Error:',
      JSON.stringify({
        message: apiError.message,
        status: apiError.status,
        details: apiError.details,
      }),
    );

    return Promise.reject(apiError);
  },
);

export default apiClient;
