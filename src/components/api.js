import axios from 'axios';

const API_BASE_URL = 'https://mware.ulka.tv';
const LOGIN_ENDPOINT = '/apiv2/credentials/loginMini';
const CHANNELS_ENDPOINT = '/apiv2/channels/list';
const PALLYCON_TOKEN_ENDPOINT = '/apiv2/pallycon/TokenIssue';

// Helper function to get current token
export const getCurrentToken = () => {
  return localStorage.getItem('ulka_token');
};

// Login API call
export const loginUser = async (username, password, appId) => {
  const apiBody = {
    auth: `username=${username};password=${password};boxid=undefined;appid=${appId};timestamp=${Date.now()}`,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}${LOGIN_ENDPOINT}`, apiBody);
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// Get channels list API call
export const getChannels = async (token = null) => {
  const currentToken = token || getCurrentToken();
  if (!currentToken) {
    throw new Error('No authentication token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}${CHANNELS_ENDPOINT}`, { 
      auth: currentToken 
    });
    return response.data;
  } catch (error) {
    console.error('Channels API Error:', error);
    throw error;
  }
};

// Get PallyCon token API call
export const getPallyTokenFromNetwork = async (contentId) => {
  const currentToken = getCurrentToken();
  
  return fetch(`${API_BASE_URL}${PALLYCON_TOKEN_ENDPOINT}?contentId=${contentId}`, {
    method: 'GET',
    headers: {
      auth: 'auth=' + currentToken,
    },
  })
    .then((serverdata) => serverdata.json())
    .then((data) => data);
};