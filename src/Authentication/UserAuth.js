import { useState } from 'react';

export const useAuth = () => {
    
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = () => {
    // Perform login logic and set isLoggedIn state to true
    setLoggedIn(true);
    
  };

  const logout = () => {
    // Perform logout logic and set isLoggedIn state to false
    setLoggedIn(false);
    
  };

  return { isLoggedIn, login, logout };
};
