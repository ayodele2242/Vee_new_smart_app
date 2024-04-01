import React, { ChangeEvent, useState, useRef, MouseEvent, RefObject, useEffect } from 'react';
import { useShoppingCart } from "use-shopping-cart";
import {
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenuItem,
} from "@nextui-org/navbar";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useNavigate } from 'react-router-dom';
import { Avatar } from "@nextui-org/react";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { ThemeSwitch } from "@/components/theme-switch";
import UserMenus from "./UserMenus/page";
import SearchInput from "./SearchInput/page";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Logo } from "@/components/icons";
import Partners from './Home/Partners';
import About from './Home/About';
import Header from './Home/Header/page';
import Vendors from './Vendors';
import Autocomplete from './SearchInput/Autocomplete/page';
import { useImage } from '@/providers/ImageContext'; 
import {
    isUserLoggedIn,
    getUserData,
    redirectToLoginPage,
} from "@/auth/auth";

import { fetchCart } from "@/services/requestAll.service"
//import { useCartStore } from "@/hooks/store/cart.store"
import useCartStore from '@/store/cart';
import { useRouter, useSearchParams } from "next/navigation";
import useRouting from "@/hooks/routing";


interface NavbarProps {
    onSelectedCategoriesChange: (selectedCategories: { category: string[] }) => void;
    hideUserMenus?: boolean;
}


export const Navbar: React.FC<NavbarProps> = ({ onSelectedCategoriesChange, hideUserMenus }) => {


    const router = useRouter();
    const { get } = useSearchParams();
    const userData = getUserData()
    const [isScrolled, setIsScrolled] = useState(false);
    const isScrolledRef = useRef(isScrolled);
    const [isOpen, setIsOpen] = useState(false);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [isVendorsOpen, setIsVendorsOpen] = useState(false);
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
    const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
    const [isOtherDropdownOpen, setOtherDropdownOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const [totalItemsInCart, setTotalItemsInCart] = useState<number>(0);
    const search = get("search")
    const { cartItems } = useCartStore();
    const [cartCount, setCartCount] = useState<number>(cartItems.length);
    const { uploadedImage } = useImage();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const { setParam } = useRouting();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const isLogin = isUserLoggedIn();
    const goToProduct = (path: string) => {
        setParam(path, "products", "search");
      };
	
      const profileName =
      userData && userData.profile_name ? userData.profile_name : "Guest"

    useEffect(() => {
        // Update cartCount whenever cart change
        setCartCount(cartItems.length);
        setLoaded(true); // Set loaded to true once cart is available
    }, [cartItems]);


    useEffect(() => {
        // Check if localStorage is available (client-side)
        if (typeof window !== 'undefined' && localStorage.getItem('uploadedImage')) {
          const img = localStorage.getItem('uploadedImage');
          setProfilePicture(img);
        } else {
          setProfilePicture(uploadedImage);
        }
      }, [uploadedImage]);


    useEffect(() => {
        isScrolledRef.current = isScrolled;
    }, [isScrolled]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollThreshold = 30;
            const isScrollPastThreshold = scrollTop > scrollThreshold;

            setIsScrolled(isScrollPastThreshold);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);





    const handleOtherDropdownToggle = () => {
        setOtherDropdownOpen(!isOtherDropdownOpen);
    };

    const handleUserMenuToggle = () => {
        setUserMenuOpen(!isUserMenuOpen);
    };

    const handleSelected = (selectedItem: string) => {
        // You can perform any additional logic here if needed
        onSelectedCategoriesChange({ category: [selectedItem] });
    };


    const handleSearchTerm = (searchTerm: string) => {
        setParam(searchTerm, 'products', 'search');
       // goToProduct(searchTerm);
    };


    const handleLinkClick = (item: { label: string; href: string }) => {
        setActiveLink(item.label);
        //toggleDropdown();

        // Check for specific labels to handle dropdowns
        if (item.label === 'Products') {
            toggleDropdown();
            setIsBrandOpen(false);
            setIsAboutUsOpen(false);
            setIsVendorsOpen(false);
        } else if (item.label === 'Partners') {
            toggleBrandDropdown();
            setIsOpen(false);
            setIsAboutUsOpen(false);
            setIsVendorsOpen(false);
        } else if (item.label === 'Deals') {
            // Handle dropdown for Deals
            // Implement your dropdown logic for Deals
            console.log('Dropdown logic for Deals');
        } else if (item.label === 'About Us') {
            toggleAboutUsDropdown();
            setIsOpen(false);
            setIsBrandOpen(false);
            setIsVendorsOpen(false);
        } else if (item.label === 'Brands') {
            toggleVendorsDropdown();
            setIsOpen(false);
            setIsBrandOpen(false);
        } else {
            //console.log('Navigate to link page:', item.href);
        }
    };

    const toggleVendorsDropdown = () => {
        setIsVendorsOpen(!isVendorsOpen);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleBrandDropdown = () => {
        setIsBrandOpen(!isBrandOpen);
    };

    const toggleAboutUsDropdown = () => {
        setIsAboutUsOpen(!isAboutUsOpen);
    };

    const handleItemClick = (item: string) => {
        console.log(`Clicked on ${item}`);
        setIsOpen(false);
        setIsBrandOpen(false);
        setIsAboutUsOpen(false);
    };

    const handleOutsideClick = (event: MouseEvent<Document>) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setIsBrandOpen(false);
            setIsAboutUsOpen(false);
            setIsVendorsOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsBrandOpen(false);
                setIsAboutUsOpen(false);
                setIsVendorsOpen(false);
                setUserMenuOpen(false);
            }
            console.log("Clicked outside");
        };

        if (isOpen || isBrandOpen || isAboutUsOpen || isVendorsOpen) {
            document.addEventListener('mousedown', handleOutsideClick as unknown as EventListener);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick as unknown as EventListener);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick as unknown as EventListener);
        };
    }, [isOpen, isBrandOpen, isAboutUsOpen, isVendorsOpen]);

    return (
        <NextUINavbar
            key={isScrolled ? 'scrolled' : 'notScrolled'}
            maxWidth="full"
            position="sticky"
            className={`
            sm:pt-3 topNav ${isScrolled ? 'scrolledBar' : ''}
          `}>
            <NavbarContent
                className="basis-1/5 sm:basis-full leftItems" justify="start">
                <div className="imgBody">
                    <NavbarBrand as="li" className="gap-3 max-w-fit  ">
                        <NextLink className="flex justify-start  gap-1" href="/">
                            <Image
                                src="/images/logoheader.png"
                                alt="Logo"
                                width={370}
                                height={120}
                                className="siteLogo" />

                        </NextLink>
                    </NavbarBrand>

                </div>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full rightItems"
                justify="end"
            >

                <div className="overAllHeader">
                    <div className="topMenu mb-0 mt-3">

                        <ul className="hidden lg:flex gap-4 justify-start ml-2">
                            {siteConfig.menu1.map((item, index, array) => (
                                <NavbarItem key={item.id}>
                                    <NextLink
                                        className={clsx(
                                            linkStyles({ color: "foreground" }),
                                            "data-[active=true]:text-primary data-[active=true]:font-bold font-semibold"
                                        )}
                                        color="foreground"
                                        href={item.href}
                                    >
                                        {item.label}
                                        {index !== array.length - 1 && <span className="mr-1 ml-4">|</span>}
                                    </NextLink>
                                </NavbarItem>
                            ))}
                        </ul>
                    </div>

                    <div className="middleMenus lg:flex mb-1 mt-2">
                        <NavbarItem className="hidden sm:flex gap-2">
                            <ThemeSwitch className="mr-4" />
                        </NavbarItem>
                        <div className="hidden sm:flex">
                            {/*<SearchInput />*/}
                            <Autocomplete handleSelected={handleSelected}  />

                        </div>
                        <Image
                            src="/images/quick_notes-transformed.png"
                            alt="Logo"
                            width={90}
                            height={37}
                            className="ml-4 mr-4 hidden sm:flex" />

                        <div className="cartContainer hidden sm:flex" suppressHydrationWarning>
                            <Link href="/cart">
                                <ShoppingCartOutlinedIcon className="cartIcon mr-4 text-black" />
                                {loaded && cartCount > 0 && (
                                    <div className='cartCounter' >
                                        {loaded ? cartCount : ''}
                                    </div>
                                )}
                            </Link>
                        </div>
                        <div className="hidden sm:flex">
                            {!hideUserMenus && (
                                <UserMenus onOtherDropdownToggle={handleOtherDropdownToggle} isOtherDropdownOpen={isOtherDropdownOpen} />
                            )}
                        </div>

                    </div>
                    <div className="bottomMenus relative" ref={dropdownRef}>

                        <ul className="hidden lg:flex gap-4 justify-start ml-2">
                            {siteConfig.navItems.map((item, index) => (
                                <NavbarItem key={index} className="b-items">
                                    <NextLink
                                        onClick={() => handleLinkClick(item)}
                                        className={clsx(
                                            linkStyles({ color: "foreground" }),
                                            {
                                                'default-color font-bold': item.label === activeLink,
                                                'text-xl font-semibold text-shadow': item.label !== activeLink,
                                            },
                                            "mr-3 items-links "
                                        )}
                                        color="foreground"
                                        href={item.href}
                                    >
                                        {index === 0 && <EqualizerIcon className="equalizer-icon rotate-up product-icon" />} {item.label}
                                    </NextLink>
                                </NavbarItem>
                            ))}
                        </ul>

                        {isOpen && (
                            <div className="products-dropdown-menu">
                                <div className="products-dropdown-menu-inner">
                                    <Header />
                                </div>
                            </div>
                        )}

                        {isVendorsOpen && (
                            <div className="vendors-dropdown-menu">
                                <div className="partners-dropdown-menu-inner">
                                    <Vendors />

                                </div>
                            </div>
                        )}


                        {isBrandOpen && (
                            <div className="partners-dropdown-menu">
                                <div className="partners-dropdown-menu-inner">
                                    <Partners />

                                </div>
                            </div>
                        )}
                        {isAboutUsOpen && (
                            <div className="partners-dropdown-menu">
                                <div className="partners-dropdown-menu-inner">
                                    <About />

                                </div>
                            </div>
                        )}



                    </div>

                </div>

            </NavbarContent>

            {/*Mobile view layout*/}
            <NavbarContent className="sm:hidden basis-1 pl-1" justify="end">
              <PersonIcon fontSize="large" onClick={handleUserMenuToggle} />
                <div className="cartContainer" suppressHydrationWarning>
                    <Link href="/cart">
                        <ShoppingCartOutlinedIcon className="cartIcon text-black" />
                        {loaded && cartCount > 0 && (
                            <div className='cartCounter' >
                                {loaded ? cartCount : ''}
                            </div>
                        )}
                    </Link>
                </div>
                {/*<ThemeSwitch />*/}
                
                {isUserMenuOpen && (
                
                <div className="userMobile-Menu w-[400px] h-[600px]">
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
              <div className='profileAvatar'>
                {profilePicture && (
                  <Avatar  src={profilePicture} className="w-6 h-6 text-tiny"  />
                )}
                {!profilePicture && (
                  <PermIdentityOutlinedIcon fontSize="large" className="mr-3 userIcon"/>
                )}
              </div>
              <div className='profileName '>
                <div className='greeting font-normal text-[1.1rem] text-small'>Welcome Back</div>
                <div className='name font-semibold text-[1.1rem] truncate text-ellipsis overflow-hidden'>{profileName}</div>
              </div>

            </div>  
            <div className="mb-2 border-b-1 border-yellow-500 w-full"></div>
              <Link href="/account/my_orders" className="w-full  mb-2 font-normal flex-item tracking-wide group-hover:text-blue-500"><DescriptionOutlinedIcon fontSize="medium" className="mr-1"/> My Orders</Link>
              <Link href="/messages" className="w-full  mb-2 font-normal  flex-item tracking-wide"><MessageOutlinedIcon fontSize="medium" className="mr-1"/> Messages</Link>
              <Link href="/account/wishlist" className="w-full  mb-2 font-normal flex-item tracking-wide"><FavoriteBorderOutlinedIcon fontSize="medium" className="mr-1"/> Wishlist</Link>
              <Link href="/account/profile-settings" className="w-full  mb-2 font-normal flex-item tracking-wide"><ManageAccountsOutlinedIcon fontSize="medium" className="mr-1"/> Profile Settings</Link>
              <Link href="/account/address-book" className="w-full  mb-2 font-normal flex-item tracking-wide">
             <ContactsOutlinedIcon  fontSize="medium" className="mr-1" />Address Book
            </Link>
              <Link href="#" 
              onClick={ redirectToLoginPage } 
              className="w-full  mb-2 font-normal flex-item bg-red-500 p-2 mt-3 text-white tracking-wide"><LogoutOutlinedIcon fontSize="medium" className="mr-1"/> Log Out</Link>

            </>
            
             }
                    
                </div>
                  
                )}
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarMenu>
                {/*<SearchInput />*/}
                <div className="mt-6">
                    <Autocomplete handleSelected={handleSelected}  />
					
                </div>

                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="text-black-500 cursor-pointer"
                                href={item.href}
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </NextUINavbar>

    );
};

export default Navbar;
