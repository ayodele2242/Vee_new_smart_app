"use client"

import React, { useState, useRef, MouseEvent, RefObject, useEffect } from 'react';
import { Avatar } from "@nextui-org/react";
import Link from "next/link";

interface UserMenusProps {
  onOtherDropdownToggle: () => void;
  isOtherDropdownOpen: boolean;
}

const UserMenus: React.FC<UserMenusProps> = ({ onOtherDropdownToggle, isOtherDropdownOpen }) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onOtherDropdownToggle();
  };

  const handleItemClick = (item: string) => {
    console.log(`Clicked on ${item}`);
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent<Document>) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick as unknown as EventListener);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick as unknown as EventListener);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick as unknown as EventListener);
    };
  }, [isOpen]);

 

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-icon" onClick={toggleDropdown}>
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-8 h-8 text-tiny" />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-menu-inner">
            <div className="profile-header w-full">
              <div className='profileAvatar'></div>
              <div className='profileName'>
                <div className='greeting font-bold text-[1.1rem]'>Hello</div>
                <div className='name font-semibold text-[1.1rem]'>User Name Here</div>
              </div>
            </div>

            <div className="dropdown-item w-full pl-4 pr-4">
             <Link href="#signout" className="divide-y w-full  mb-1 font-semibold tracking-wide signout group-hover:text-blue-500">Sign In / Register</Link>
             <Link href="#my-orders" className="w-full  mb-1 font-semibold tracking-wide group-hover:text-blue-500">My Orders</Link>
             <Link href="#messages" className="w-full  mb-1 font-semibold tracking-wide">Messages</Link>
             <Link href="#wishlist" className="w-full  mb-1 font-semibold tracking-wide">Wishlist</Link>
             <Link href="#profile-settings" className="w-full  mb-1 font-semibold tracking-wide">Profile Settings</Link>

             
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenus;
