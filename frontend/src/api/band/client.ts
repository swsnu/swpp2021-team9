import axios from 'axios';

const apiClient = axios.create();

apiClient.defaults.xsrfCookieName = 'csrftoken';
apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';

apiClient.get('/api/token/');

export { apiClient };
