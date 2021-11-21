import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, getSessionData } from './auth';
import history from './history';

type LoginData = {
  username: string;
  password: string;
}

const  BASE_URL = "http://localhost:8080";

/**
 * intercepta todas as requisicoes
 * redireciona rota para login quando nao autorizado
 */
axios.interceptors.response.use(function(response) {
  return response;
}, function(error){
  if(error.response.status === 401) {
    history.push('/auth/login');
  }
  return Promise.reject(error);
});

/**
 * funcao responsavel por fazer as requisicoes ao back-end
 * conforme headers e objetos passados como parametros
 */
export const makeRequest = (params: AxiosRequestConfig) => {
  return axios({
    ...params,
    baseURL: BASE_URL
  });
}

/**
 * fucao responsavel por fazer requisicoes que exigem estar autenticado
 * adiciona o token ao header e chama a funcao que dispara requisicoes
 * ao back-end
 */
export const makePrivateRequest = (params: AxiosRequestConfig) => {
  const sessionData = getSessionData();
  const headers = {
    'Authorization': `Bearer ${sessionData.access_token}`
  }
  return makeRequest({ ...params, headers });
}

/**
 * funcao responsavel por fazer o login 
 * 
 * @param loginData
 * @returns 
 */
export const makeLogin = (loginData: LoginData) => {
  const token = `${CLIENT_ID}:${CLIENT_SECRET}`;

  const headers = {
    Authorization: `Basic ${window.btoa(token)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const payload = qs.stringify({ ...loginData, grant_type: 'password' });
  return makeRequest({ url: '/oauth/token', data: payload, method: 'POST', headers});
}
