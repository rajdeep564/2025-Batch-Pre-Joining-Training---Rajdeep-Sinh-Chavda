import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const fetchPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};