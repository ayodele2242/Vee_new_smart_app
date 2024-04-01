import { useEffect, useState } from 'react';

const useAutoLogout = (expirePeriod: number) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const expirationTime = parseInt(localStorage.getItem('expire_period') || '0', 10);
    
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > expirationTime) {
        // Time expired, log out the user
        setIsLoggedIn(false);
        // Clear local storage or perform any other logout action
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('uploadedImage');
        localStorage.removeItem('expire_period');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return isLoggedIn;
};

export default useAutoLogout;
