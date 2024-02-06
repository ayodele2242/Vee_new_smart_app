"use client"

import React, { useState, useRef, MouseEvent, RefObject, useEffect } from 'react';
import { Avatar } from "@nextui-org/react";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Link from "next/link";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SingleLoader from '@/loaders/singleLoader';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";

interface UserMenusProps {
  onOtherDropdownToggle: () => void;
  isOtherDropdownOpen: boolean;
}

const UserMenus: React.FC<UserMenusProps> = ({ onOtherDropdownToggle, isOtherDropdownOpen }) => {
  const userData = getUserData()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const isLogin = isUserLoggedIn();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [greetingText, setGreetingText] = useState('');
  const [userName, setUserName] = useState('');
  const [truncatedUserName, setTruncatedUserName] = useState('');




  const profileName =
		userData && userData.profile_name ? userData.profile_name : "Guest"





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
    setIsLoading(false);

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
      <div className="dropdown-icon user-menus " onClick={toggleDropdown}>
       <div className="user-icon"><PermIdentityOutlinedIcon fontSize="large" className=""/></div>
       <div className="user-name cursor-pointer hidden sm:flex md:flex system-only">

       {isLoading && (
            <>
              <div className="greeting txt-smaller mb-1"><SingleLoader numberOfItems={1} /></div>
              <div className="iname text-sm font-bold flex user-description"><SingleLoader numberOfItems={1} /> <KeyboardArrowDownOutlinedIcon /></div>
            </>
        )}


       {isLogin && !isLoading && (
            <>
              <div className="greeting txt-smaller">Hi</div>
              <div className="iname text-sm font-bold flex user-description truncate text-ellipsis lg:w-[70px]">{profileName} <KeyboardArrowDownOutlinedIcon /></div>
            </>
          )}

       {!isLogin && !isLoading && (
            <>
              <div className="greeting txt-smaller">Welcome</div>
              <div className="iname text-sm font-bold flex row-layout">Login / Signup <KeyboardArrowDownOutlinedIcon /></div>
            </>
        )}
       </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-menu-inner">
            {!isLogin && 
             <div className="dropdown-item w-full pl-4 pr-4">
              <div className=" w-100 flex justify-center  register-container mb-1 bg-yellow-600 p-1 text-white font-semibold"><Link href="login" className="w-100">Login</Link></div>
             <div className="w-100 mb-2 w-100 flex justify-center register-container  p-2 text-gray font-semibold"><Link href="register" className="w-100">Signup</Link></div> 
             <div className="mb-2 border-b-1 border-yellow-500 w-full"></div>
              <Link href="#" className="w-full  mb-2 font-normal flex-item tracking-wide group-hover:text-blue-500"><DescriptionOutlinedIcon fontSize="medium" className="mr-1"/> My Orders</Link>
            <Link href="#" className="w-full  mb-2 font-normal  flex-item tracking-wide"><MessageOutlinedIcon fontSize="medium" className="mr-1"/> Messages</Link>
            <Link href="#" className="w-full  mb-2 font-normal flex-item tracking-wide"><FavoriteBorderOutlinedIcon fontSize="medium" className="mr-1"/> Wishlist</Link>
            <Link href="#" className="w-full  mb-2 font-normal flex-item tracking-wide"><ManageAccountsOutlinedIcon fontSize="medium" className="mr-1"/> Profile Settings</Link>
           </div>
             }
            
            

            {isLogin && 
             <>
            <div className="profile-header w-full">
              <div className='profileAvatar'></div>
              <div className='profileName '>
                <div className='greeting font-normal text-[1.1rem] text-small'>Welcome Back</div>
                <div className='name font-semibold text-[1.1rem] truncate text-ellipsis overflow-hidden'>{profileName}</div>
              </div>

            </div>  
            <div className="mb-2 border-b-1 border-yellow-500 w-full"></div>
              <Link href="/account/my_orders" className="w-full  mb-2 font-normal flex-item tracking-wide group-hover:text-blue-500"><DescriptionOutlinedIcon fontSize="medium" className="mr-1"/> My Orders</Link>
              <Link href="/account/messages" className="w-full  mb-2 font-normal  flex-item tracking-wide"><MessageOutlinedIcon fontSize="medium" className="mr-1"/> Messages</Link>
              <Link href="/account/wishlist" className="w-full  mb-2 font-normal flex-item tracking-wide"><FavoriteBorderOutlinedIcon fontSize="medium" className="mr-1"/> Wishlist</Link>
              <Link href="/account/profile-settings" className="w-full  mb-2 font-normal flex-item tracking-wide"><ManageAccountsOutlinedIcon fontSize="medium" className="mr-1"/> Profile Settings</Link>
              <Link href="#" 
              onClick={ redirectToLoginPage } 
              className="w-full  mb-2 font-normal flex-item bg-red-500 p-2 mt-3 text-white tracking-wide"><LogoutOutlinedIcon fontSize="medium" className="mr-1"/> Log Out</Link>

            </>
            
             }
             

           
           
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenus;
