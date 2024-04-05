"use client"

import React, { useEffect, useState } from 'react';
import useCartStore  from '@/store/cart';
import { VeeCartItem } from '@/types/types';
import {Breadcrumbs, BreadcrumbItem, Button, Spinner} from "@nextui-org/react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import Link from 'next/link';
import toast from "react-hot-toast";
import Image from 'next/image';
import SingleLoader from '@/loaders/singleLoader';
import { Checkbox } from "@nextui-org/react";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service";

const CartPageComponent: React.FC = () => {
  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<VeeCartItem[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const { cartItems, removeItemFromCart, removeMultipleItemsFromCart } = useCartStore();
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("")
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);

	const [formData, setFormData] = useState({
		selectedCountry: "",
		state: "",
		zip: "",
	})



  useEffect(() => {
	console.log(JSON.stringify(cartItems));
    setBgHeroLeftSrc(bgHeroLeft.src);
	fetchCountries()
	.then((data) => {
	  setCountries(data);
	  setLoading(false); 
	})
	.catch((error) => {
	  console.log("Error occurred " + error);
	  setLoading(false);
	});
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="h-[100vh] w-full flex justify-center text-center overlayer">
      <div className="loadig mb-3">Loading cart items...</div>
      <SingleLoader numberOfItems={1} />
      </div>; 
  }

  const selectedSearchedItems = (selectedItem: any) => {
    // Handle selected items here
  };



const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	setSelectedCountry(e.target.value);
	const selectedCountry = e.target.value;
	setFormData({
		...formData,
		selectedCountry,
	});

	fetchStatesByCountry(e.target.value)
		.then((data) => {
			setStates(data);
		})
		.catch((error) => {
			console.log("Error occurred " + error);
		});
};

  const overallSum = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAllChecked(checked);
    
    if (checked) {
      const selectedItems = cartItems.map(item => item.ingramPartNumber);
      setSelectedItems(cartItems.filter(item => selectedItems.includes(item.ingramPartNumber)));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
	const { name, value } = e.target
	setFormData({
		...formData,
		[name]: value,
	})
}

  
  
  

  const handleCheckboxChange = (item: VeeCartItem) => {
    const selectedIndex = selectedItems.findIndex(selectedItem => selectedItem.ingramPartNumber === item.ingramPartNumber);
    const newSelectedItems = [...selectedItems];
    
    if (selectedIndex === -1) {
      newSelectedItems.push(item);
    } else {
      newSelectedItems.splice(selectedIndex, 1);
    }
    
    setSelectedItems(newSelectedItems);
    setSelectAllChecked(newSelectedItems.length === cartItems.length);
  };
  
  

  const handleDeleteSelected = () => {
    removeMultipleItemsFromCart(selectedItems);
    setSelectedItems([]);
    setSelectAllChecked(false);
  };


  const handleDeleteItem = (item: VeeCartItem) => {
    removeItemFromCart(item.ingramPartNumber);
    console.log(JSON.stringify(item))
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	

	  // Check if any form field is empty
	  const emptyFields = Object.values(formData).some(value => value === "");

	  if (emptyFields) {
	   
		  toast.error("Please fill in all the required fields.", {});
		 

		  return;
	  }

	 // const localStorageService = new LocalStorageService("checkoutFormData");
	 // localStorageService.setData("formData", formData);
};

const handleProceedToCheckout = () => {
    setShowSpinner(true);
  };

  return (
    <div className="w-full" style={{
      backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
      backgroundPosition: 'right bottom',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar onSelectedCategoriesChange={selectedSearchedItems} />

      <div className="w-full pl-10 pb-3 ">
        <Breadcrumbs>
      <BreadcrumbItem href="/"><h3 className="text-lg font-extrabold text-yellow-600">Home</h3></BreadcrumbItem>
      <BreadcrumbItem><h3 className="text-lg font-extrabold">Cart</h3></BreadcrumbItem>
      
    </Breadcrumbs>
        </div>
      <div className='w-full cartAll bg-[#ffffff] p-10 gap-4'>
        <div className="mb-3 ml-8 w-full font-extrabold text-lg">My Cart <EditNoteOutlinedIcon fontSize="large"/></div>
        <div className="w-full justify-between sCart  flex column ">
         
          <div className="cartBody lg:w-[65%] md:w-[100%]">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="table-wrapper inline-block min-w-full overflow-hidden">
              <table className="min-w-full leading-normal text-sm txt-small text-left  text-gray-500 border-b-[2px] border-yellow-600 border-dashed">
                <thead className="text-sm txt-small  uppercase">
                  <tr className="font-bold text-black text-md border-b-[2px] border-yellow-600 border-dashed">
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    <Checkbox checked={selectAllChecked} onChange={handleSelectAll} />
                    </th>
                    <th scope="col" className="px-5 py-3  text-left text-xs font-semibold  uppercase tracking-wider">
                      Item Description
                    </th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold  uppercase tracking-wider whitespace-nowrap">
                      Unit Price
                    </th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item: VeeCartItem, index: number) => (
                     <tr  key={index}>
					<td  className="px-5 py-5  bg-white text-sm">
						<Checkbox
						checked={selectedItems.includes(item)}
						onChange={() => handleCheckboxChange(item)}
						/></td>
					 <td className="px-5 py-5  bg-white text-sm">
					   <div className="flex flex-col lg:flex-row">
						 <div className="flex-shrink-0">
						 <Image 
                            src={item.image_url}
                            alt="Trash"
                            className="mr-2"
                            width={80}
                            height={80}
                          />
						 </div>
						 <div className="ml-3">
						   <p className="text-gray-900 whitespace-no-wrap font-semibold">
						   
						   <Link href={`/productdetail?id=${item.ingramPartNumber}`} className="text-xs">
							{item.description}
							</Link>
						   </p>
						   <p className="text-gray-600 whitespace-no-wrap"><small>{item.descr}</small></p>
						 </div>
					   </div>
					 </td>
					 <td className="px-5 py-5  bg-white text-sm">
					   <p className="text-gray-900 whitespace-no-wrap font-extrabold">	
					 
					   {new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD'
						}).format(item.price)}
					   
					   </p>
					   
					 </td>
					 <td className="px-5 py-5  bg-white text-sm">
					   <p className="text-gray-900 whitespace-no-wrap">
					   <CartQuantityActionBtns 
						product={item} 
						id={item?.ingramPartNumber}
						hideButton={true}
							/>
					   </p>
					  
					 </td>
					 <td className="relative">
					 <div className="w-full text-right absolute top-0 pt-2 pr-3">
                         <DescriptionOutlinedIcon className="mr-3"/>
                        <DeleteOutlinedIcon onClick={() => handleDeleteItem(item)} />
                        </div>
					   <span
						 className="relative inline-block px-3 py-1 w-full font-semibold text-green-900 leading-tight"
					   >
						
						 <span className="relative font-extrabold"> 
						 {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(item.price * item.quantity)}</span>
					   </span>
					 </td>
					
				   </tr>
                  ))}
                </tbody>
              </table>
              </div>
			  </div>
            )}
          </div>

          <div className="cartSummary lg:w-[25%] md:w-[100%]">
          
                        <div className="flex flex-col">
			<div className="text-md font-semibold">
				<h1 className="my-3">Summary</h1>
				<div className="inset-0">
					<div className="h-[2px] w-auto bg-gray-200" />
				</div>
			</div>
			<div className="text-md font-medium">
				<h2 className="my-3">Estimate Shipping and Tax</h2>
			</div>
			<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
			<div className="mb-3">
				<label htmlFor="countries" className="font-300">
					Country
				</label>
				<select
					value={selectedCountry}
					onChange={handleCountryChange}
					className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option value=""></option>
					{countries.map((country) => (
						<option
							key={country.id}
							value={country.id}
						>
							{country.name}
						</option>
					))}
				</select>
			</div>
			<div className="mb-3">
				<label htmlFor="countries" className="font-300">
					State/Province
				</label>
				<select
					name="state"
					value={formData.state}
					onChange={handleChange}
					className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option></option>
					{states.map((state) => (
						<option
							key={state.id}
							value={state.name}
						>
							{state.name}
						</option>
					))}
				</select>
			</div>
			<div className="mb-3">
				<label htmlFor="countries" className="font-300">
					Zip/Postal Code
				</label>
				<input
					name="zip"
					placeholder="44167"
					className="border border-gray-300 text-gray-900 text-sm txt-small rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mt-2"
				/>
			</div>
			<button
									type="submit"
									className="w-full text-white bg-yellow-600 hover:bg-yellow-700  focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover-bg-yellow-700 dark:focus:ring-yellow-800 warning-btn"
								>
									Shipping Estimate
								</button>
			</form>
			{/*<div className="mb-4 mt-4">
				<h3 className="font-300 font-bold">Shipped by Your Account</h3>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900"
					>
						Your Account <b>$15,966.90</b>
					</label>
				</div>
			</div>
			<div className="mb-3">
				<h3 className="font-300 font-bold">Table Rate</h3>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900"
					>
						UPS WOrldwide Expedited <b>$26.00</b>
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900 "
					>
						UPS Worldwide Express Saver <b>$29.00</b>
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900"
					>
						DHL Priority <b>$33.00</b>
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900"
					>
						FedEx Priority <b>$35.00</b>
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="default-radio-1"
						type="radio"
						defaultValue=""
						name="default-radio"
						className="w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
					/>
					<label
						htmlFor="default-radio-1"
						className="text-sm txt-small sm:text-base ml-4 flex items-center gap-4 font-normal text-gray-900"
					>
						EMS Speed Post <b>$51.00</b>
					</label>
				</div>
			</div>*/}




			<div className="flex justify-between text-md font-normal mt-3">
				<p className="font-bold">Subtotal</p>
				<p className="font-bold">{new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(overallSum)}</p>
			</div>
			{/*<div className="flex justify-end text-md font-normal ">
				<p className="mt-2 mb-3">
					Shipping (Table Rate - UPS Worldwide Expedited)
				</p>
				<p className="mt-2 mb-3 font-bold">
        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(overallSum)}
				</p>
			</div>*/}
			<div className="inset-0">
				<div className="h-[2px] w-auto bg-gray-200" />
			</div>
			<div className="text-md font-semibold flex justify-between ">
				<h1 className="mt-2 mb-3 text-gray-500">Order Total</h1>
				<h1 className="mt-2 mb-3 text-red-400 font-bold">
        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(overallSum)}
				</h1>
			</div>
			<Link
				href={"/cart/checkout"}
				className="flex justify-center gap-4 mt-4 bg-blue-500 px-4 py-3 flex justify-center rounded text-white hover:bg-blue-500 transition"
				onClick={handleProceedToCheckout}
			>
				{showSpinner && <Spinner  size="sm"/>} 
				{showSpinner ? 'Please wait...' : 'Proceed to Checkout'}
			</Link>
			{/*<PayPalPayment className="-mt-8" />*/}
		</div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default CartPageComponent;
