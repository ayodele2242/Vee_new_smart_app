import axios, { AxiosResponse } from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: number;
  root_menu: string;
  sub_categories: {
    sub_id: number;
    name: string;
  }[];
}


interface Subcategory {
  // Define your subcategory properties here
}

interface Product {
  // Define your product properties here
}

export const getCategories = (): Promise<Category[]> => {
  return axios
    .get<Category[]>(API_URL + 'category/')
    .then((response: AxiosResponse<Category[]>) => response.data);
};

export const fetchData = (url: string, data: any): Promise<any> => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  console.log('Request URL:', API_URL + url);
  console.log('Request Headers:', headers);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const axiosConfig = {
    headers,
  };

  return axios
    .post(API_URL + url, data, axiosConfig)
    .then((response: AxiosResponse<any>) => response.data)
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
};

export const fetchCategories = (data: any): Promise<any[]> => {
  return axios
    .post(API_URL + 'products/categories', data)
    .then((response: AxiosResponse<any>) => response.data.data)
    .catch((error) => {
      console.error('Error fetching categories:', error);
      throw error;
    });
};


export const fetchSubcategories = (categoryId: number): Promise<Subcategory[]> => {
  return axios
    .get<Subcategory[]>(API_URL + `categories/${categoryId}/subcategories`)
    .then((response: AxiosResponse<Subcategory[]>) => response.data)
    .catch((error) => {
      console.error('Error fetching subcategories:', error);
      throw error;
    });
};

export const fetchProductsByCategory = (categoryId: number): Promise<Product[]> => {
  return axios
    .get<Product[]>(API_URL + `categories/${categoryId}/products`)
    .then((response: AxiosResponse<Product[]>) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
};
