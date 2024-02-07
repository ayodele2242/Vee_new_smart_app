import axios, { AxiosResponse } from 'axios';

// Define an interface for your response data
interface ApiResponse<T> {
  xpire(arg0: string, xpire: any): unknown;
  image(arg0: string, image: any): unknown;
  totalRecords(totalRecords: any): unknown;
  data(data: any): any;
  message: string;
  token?: string;
  userinfo?: T;
  status?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestService {
  private static setTokenInStorage(token: string): void {
    // Add your implementation to store the token in localStorage
  }

  private static getTokenFromStorage(): string | null {
    // Add your implementation to retrieve the token from localStorage
    return localStorage.getItem('token');
  }

  private static setUserData(data: any): void {
    // Add your implementation to store user data in localStorage
  }

  private static setisUserLoggedIn(status: string): void {
    // Add your implementation to store the user login status in localStorage
  }

  public static async callAPI<T>(
    data: any,
    url: string,
    requireToken = true
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    // Check if a token is available in localStorage
    const token = ApiRequestService.getTokenFromStorage();

    // Set the Authorization header if a token is available
    const headers: Record<string, string> = {};
    if (requireToken && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    headers['Content-Type'] = 'application/json';

    try {
      const response = await axios.post<ApiResponse<T>>(API_URL + url, data, { headers });

      if (response.data.token) {
        ApiRequestService.setTokenInStorage(response.data.token);
        ApiRequestService.setUserData(response.data.userinfo);
        ApiRequestService.setisUserLoggedIn(response.data.status);
      }

      return response;
    } catch (error) {
      const axiosError = error as { response?: AxiosResponse };
      
      if (axiosError.response) {
        return Promise.reject(axiosError.response);
      } else {
        // Handle the case where error does not have a response property
        console.error('Unexpected error:', error);
        return Promise.reject(error);
      }
    }
  }
}
