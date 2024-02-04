import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';

const SideBar: React.FC = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const isLinkActive = (path: string) => {
    return activeLink === path ? 'active-link' : '';
  };

  return (
    <div className="sidebar flex flex-col w-full">
      <div className="account-top-menu-title pr-6 pl-6 pt-4 font-bold text-lg">Account</div>
      <div className="menu-list-body w-full">
        <ul>
          <li className={isLinkActive('/account/my_orders')}>
            <Link href="/account/my_orders">
             
                <DescriptionOutlinedIcon fontSize="small" className="mr-1"/> My Orders
             
            </Link>
          </li>
          <li className={isLinkActive('/account/messages')}>
            <Link href="/account/messages">
             
                <MessageOutlinedIcon fontSize="small" className="mr-1"/> Messages
             
            </Link>
          </li>
          <li className={isLinkActive('/account/wishlist')}>
            <Link href="/account/wishlist">
             
                <FavoriteBorderOutlinedIcon fontSize="small" className="mr-1"/> Wishlist
             
            </Link>
          </li>
          <li className={isLinkActive('/account/profile-settings')}>
            <Link href="/account/profile-settings">
             
                <ManageAccountsOutlinedIcon fontSize="small" className="mr-1"/> Profile Settings
             
            </Link>
          </li>
          <li className={isLinkActive('/account/address-book')}>
            <Link href="/account/address-book">
             <ContactsOutlinedIcon fontSize="small" className="mr-1" />Address Book
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
