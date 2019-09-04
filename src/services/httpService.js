import { Method, request } from "../tools/httpTools";
import { API_ENDPOINT, SOCKET_ENDPOINT, AUTH_ENDPOINT } from "../constants";
import axios from "axios";

export const getArticles = () =>
  request(Method.GET, `${API_ENDPOINT}/articles`);

export const getWeekArticles = ({ year, week }) =>
  request(Method.GET, `${API_ENDPOINT}/articles?year=${year}&week=${week}`);

export const getArticle = id =>
  request(Method.GET, `${API_ENDPOINT}/articles/${id}`);

export const deleteArticle = id =>
  request(Method.DELETE, `${API_ENDPOINT}/articles/${id}`);

export const login = ({ email, password }) =>
  request(Method.POST, `${AUTH_ENDPOINT}`, JSON.stringify({ email, password }));

export const updateArticle = ({ id, text }) =>
  request(
    Method.PUT,
    `${API_ENDPOINT}/articles/${id}`,
    JSON.stringify({ text })
  );

export const createWeek = config =>
  axios.post(`${API_ENDPOINT}/weeks`, JSON.stringify(config));

export const getConfig = () => axios.get(`${API_ENDPOINT}/config/1`);

export const updateConfig = config =>
  axios.put(`${API_ENDPOINT}/config/1`, JSON.stringify(config));

export const createArticles = articles =>
  axios.all(
    articles.map(async a => {
      const res = await axios.post(
        `${API_ENDPOINT}/articles`,
        JSON.stringify(a)
      );
      return {
        ...a,
        id: res.data,
        edited_at: "0000-00-00 00:00:00",
        created_at: new Date().toISOString()
      };
    })
  );

export const mjml2html = mjml =>
  fetch(`${SOCKET_ENDPOINT}/mjml2html`, {
    method: "POST",
    headers: { "Content-Type": "text/html" },
    body: mjml
  });

export const sendEmail = mjml =>
  fetch(`${SOCKET_ENDPOINT}/send_email`, {
    method: "POST",
    headers: { "Content-Type": "text/html" },
    body: mjml
  });

// export const createWeek = (articles) => request(Method.ALL, `/articles/${id}`, JSON.stringify(text))
