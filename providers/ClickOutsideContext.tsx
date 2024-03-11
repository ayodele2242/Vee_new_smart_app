"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ClickOutsideContextType {
  isClickedOutside: boolean;
  handleClickOutside: () => void;
}

const ClickOutsideContext = createContext<ClickOutsideContextType | null>(null);

export const useClickOutsideContext = () => useContext(ClickOutsideContext)!;

export const ClickOutsideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isClickedOutside, setIsClickedOutside] = useState(false);

  const handleClickOutside = () => {
    setIsClickedOutside(true);
  };

  return (
    <ClickOutsideContext.Provider value={{ isClickedOutside, handleClickOutside }}>
      {children}
    </ClickOutsideContext.Provider>
  );
};
