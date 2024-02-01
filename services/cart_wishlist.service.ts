import axios from 'axios';
import instance from './';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to fetch countries
export async function fetchCountries() {
  try {
    const response = await axios.get(`${API_URL}auth/countries`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch states for a specific country
export async function fetchStatesByCountry(countryId: string) {
  try {
    const response = await axios.get(`${API_URL}auth/states?countryId=${countryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCart() {
  try {
    const response = await instance.get('cart/getCart');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addToCart(payload: any) {
  try {
    const response = await instance.post('cart/addCart', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateCart(payload: any) {
  try {
    const response = await instance.post('cart/updateCart', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function removeFromCart(id: string) {
  try {
    const response = await instance.get(`/cart/deleteCart?itemid=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getWishList() {
  try {
    const response = await instance.post('/wishlist/wishlist', {
      action: 'get',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addToWishList(payload: any) {
  try {
    const response = await instance.post('/wishlist/wishlist', {
      action: 'add',
      ...payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function removeFromWishList(payload: any) {
  try {
    const response = await instance.post('/wishlist/wishlist', {
      action: 'remove',
      ...payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
