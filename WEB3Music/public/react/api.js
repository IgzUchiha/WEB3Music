let apiURL;

if (process.env.NODE_ENV === 'development') {
  apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3005/api';
} else {
  apiURL = '/api'
}

export default apiURL;
