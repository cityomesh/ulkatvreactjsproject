const URL = 'http://202.62.66.115:8080';
const BASE_URL = URL + '/';
const PALLYCON_TOKEN_URL = BASE_URL + 'apiv2/pallycon/TokenIssue';
 // live public ip
// export const URL = 'http://192.168.11.9:8080'; // live private ip

const currentToken = localStorage.getItem('ulka_token');

export const getPallyTokenFromNetwork = async (contentId) => {
  return fetch(PALLYCON_TOKEN_URL + '?contentId=' + contentId, {
    method: 'GET',
    headers: {
      auth: 'auth=' + currentToken,
    },
  })
    .then((serverdata) => {
      return serverdata.json();
    })
    .then((data) => {
      return data;
    });
};