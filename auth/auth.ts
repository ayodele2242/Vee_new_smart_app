export function isUserLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
  
    // Check if authToken is present
    if (token) {
      return true;
    }
  
    return false;
  }
  
  // Function to get user data from localStorage
  export function getUserData(): any | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  
  export function redirectToLoginPage(): void {
    window.location.href = "/login";
    localStorage.clear();
  }
  