import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllProducts = () => {
  return axios.get(`${API_URL}products/`).then(async (product) => await product.data);
};

export const fetchProducts = (data: any) => {
  return axios
    .post(`${API_URL}products/catalog`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
};


export const fetchSearch = (data: any) => {
  return axios
    .post(`${API_URL}products/query`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
};

export const fetchDefaultSearch = (data: any) => {
  return axios
    .post(`${API_URL}products/query_default`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
};

export const fetchFrontPageProducts = (data: any) => {
  return axios
    .post(`${API_URL}products/front_products`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
};

export const fetchPrice = (data: any) => {
  return axios
    .post(`${API_URL}products/price_request`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching price:', error);
      throw error;
    });
};
