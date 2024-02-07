import React, { useEffect, useState } from 'react';
import useCartStore  from '@/store/cart';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Modal from "react-modal"
import Image from "next/image";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import CheckIcon from "@mui/icons-material/Check"
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { useRouter } from "next/navigation"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';
import numeral from "numeral"
import SingleLoader from '@/loaders/singleLoader';
import { ApiRequestService } from '@/services/apiRequest.service';
import { LocalStorageService } from '@/services/localStorage';
import { loadStripe } from "@stripe/stripe-js"
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service"
import {
	isUserLoggedIn
} from "@/auth/auth";
import { Spinner } from '@nextui-org/react';



interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
}

interface AddressInfo {
  nickname: string;
  company: string;
  state: string;
  address: string;
  phone: any;
  city: string;
  country: string;
  zip: any;

  // Other properties...
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL

const PaymentComponent = () => {
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { cartItems } = useCartStore();
    const isLoggedIn = isUserLoggedIn();
    const [detailsVisible, setDetailsVisible] = useState<boolean[]>(Array(cartItems.length).fill(false));
    const [clientSecret, setClientSecret] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState("")
	const [comment, setComment] = useState("")
    const [backendResponse, setBackendResponse] = useState(null)
	const [backendMsg, setBackendMsg] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [myAddressInfo, setMyAddressInfo] = useState<AddressInfo[] | null>(null);
    const { push } = useRouter()


    

    const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

    const toggleDetailsVisibility = (index: number) => {
        setDetailsVisible(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };
  
    useEffect(() => {
      setBgHeroLeftSrc(bgHeroLeft.src);
        setLoading(false);

       

      const fetchData = async () => {
        
        const addr = localStorage.getItem("myAddress");
  
        if (addr) {
          const formData = JSON.stringify({
            id: addr,
            action: "get_by_id",
          });
  
          try {
            const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "orders/shippingAddress");
            const responseData = response.data;
    
            if (response.status === 200) {
              const { status, message, data } = responseData;
              setMyAddressInfo(data);
             
                          
          } else {
              const { status, message } = responseData;
              toast.error(message);
              setBackendResponse(status);
          }
          
        } catch (error) {
            toast.error("An error occurred while finalizing orders details.");
        }
        }
      };
  
      fetchData();
    }, []);
    

    if (loading) {
      return <div className="h-[100vh] w-full flex justify-center text-center overlayer transparent">
        <div className="loadig mb-3">Loading. Please wait...</div>
        <SingleLoader numberOfItems={1} />
        </div>; 
    }

        const localStorageService = new LocalStorageService('checkoutFormData');
        // Define the key you want to retrieve data for
        const keyToRetrieve = 'formData';
        // Retrieve the data associated with the key
        const retrievedData = localStorageService.getData<any>(keyToRetrieve);
        // Use the retrieved data as needed
       // console.log(retrievedData);
       
       
       


    const overallSum = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
 

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    const handleRadioChange = (event: { target: { id: string; }; }) => {
        const selectedOption = event.target.id;
        if (selectedOption === "bank_transfer" && !isLoggedIn) {
            // Show toast message if not logged in
            toast.error("You need to log in to be able to use Bank Transfer.");
           
        } else {
            setSelectedOption(selectedOption);
        }
    };

    const handlePayment = async () => {

      setIsLoading(true);
      const response = await fetch(`/api/checkout_sessions`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineItems: cartItems }),
      });

      if (!response.ok) {
        setIsLoading(false);
          return; // Handle the error accordingly
      }

      try {
          const data = await response.json();

          if (data.clientSecret) {
            setIsLoading(false);
              setClientSecret(data.clientSecret);
              openModal();
          } else {
              console.error("Invalid clientSecret in the server response");
              setIsLoading(false);
          }
      } catch (error) {
        setIsLoading(false);
         // console.error("Error parsing JSON:", error);
      }
  };

	//Bank Transfer process
	const handleBankPayment = async () => {
    setIsLoading(true);
        const commentValue = document.getElementById("message") as HTMLInputElement | null;
        const userJson = localStorage.getItem("user")
        if (!userJson) return
        const user = JSON.parse(userJson)
    
        const formData = {
            session_id: "",
            email: user.email,
            user_id: user.user_id, // userId,
            payment_type: "bank_transfer",
            note: commentValue,
            totalPrice: numeral(overallSum).format("0,0.00"),
        };
    
        try {
            const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(formData), "checkout/checkout");
            const responseData = response.data;
    
            if (response.status === 200) {
                const { status, message } = responseData;
                setIsLoading(false);
                if (status === "error") {
                    toast.error(message);
                    setBackendMsg(message);
                    setBackendResponse(status);
                    
                } else if (status === "success") {
                    setBackendResponse(status);
                    setBackendMsg(message);
                    setIsLoading(false);
                    toast.success(message);
                    push("/account/my-orders");
                }
            } else {
              setIsLoading(false);
                if (response.status === 400) {
                    const { status, message } = responseData;
                    toast.error(message);
                    setBackendResponse(status);
                }
            }
        } catch (error) {
          setIsLoading(false);
            toast.error("An error occurred while finalizing orders details.");
        }
    };

	const renderPaymentButton = () => {
		if (selectedOption === "bank_transfer") {
			return (
				<button
					className="mt-10 flex w-full justify-center rounded-md border border-transparent bg-[#daa50e] py-2 px-4 text-sm font-medium text-white shadow-sm"
					type="submit"
					onClick={handleBankPayment}
          disabled={isLoading}
				>
					
          {isLoading && <Spinner size="sm" color="primary" />}
							{isLoading ? 'Processing...' : 'Bank Transfer'}
				</button>
			)
		} else if (selectedOption === "card") {
			return (
				<button
					className="mt-10 flex gap-2 w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm"
					type="submit"
					onClick={handlePayment} 
          disabled={isLoading}
				>
          {isLoading && <Spinner size="sm" color="primary" />}
							{isLoading ? 'Processing...' : 'Pay with Credit / Debit Card'}
					
				</button>
			)
		} else {
			return (
				<div className="mt-10 flex w-full justify-center rounded-md border border-transparent bg-[#FF0000] py-2 px-4 text-sm font-medium text-white shadow-sm">
					Select Payment Method to Continue
				</div>
			)
		}
	}

    return (
        <div className="w-full" style={{
            backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
        }}>
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} />

            <div className='w-full cartAll bg-[#ffffff] p-10 gap-4'>
            <div className="flex justify-between flex-wrap gap-y-6 sm:gap-y-10 lg:w-[65%] ">
							<h1 className="text-2xl font-bold">Checkout</h1>
							
							<div className="flex items-center">
								<div>
									<div className="relative w-[150px] sm:w-[200px] h-[5px] sm:h-2 rounded-l-full bg-gray-200">
										<div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40px] sm:w-[50px] p-1 sm:p-2 aspect-square bg-gray-200 rounded-full">
											<span className="flex justify-center items-center w-full aspect-square bg-white rounded-full">
												<CheckIcon />
											</span>
										</div>
									</div>
									<div>
										<p className="text-center mt-8">
											Shipping
										</p>
									</div>
								</div>
								<div>
									<div className="relative w-[150px] sm:w-[200px] h-[5px] sm:h-2 rounded-r-full bg-blue-500">
										<div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40px] sm:w-[50px] p-1 sm:p-2 aspect-square bg-blue-500 rounded-full">
											<span className="flex justify-center items-center w-full aspect-square bg-white rounded-full">
												<CheckIcon />
											</span>
										</div>
									</div>
									<div>
										<p className="text-center mt-8">
											Review & Payments
										</p>
									</div>
								</div>
							</div>
						</div>
                

                <div className="w-full justify-between sCart  flex column lg:p-8   md:w-[100%] ">

                    <div className="cartBody lg:w-[65%] md:w-[100%]">
                    {!isLoggedIn && <></> }
                   
                   

                    <div className="px-4">
							<h2 className="text-xl">Payment Method</h2>

							<div className="flex items-center py-4">
								<input
									id="bank_transfer"
									type="radio"
									defaultValue=""
									name="default-radio"
									className="w-[15px] sm:w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
									onChange={handleRadioChange}
								/>
								<label
									htmlFor="default-radio-1"
									className="text-xs sm:text-base ml-4 flex items-center gap-4 font-medium text-gray-900"
								>
									<CurrencyExchangeIcon className="w-[30px] sm:w-[30px] rounded" />
									Bank Transfer (T/T)
								</label>
							</div>
							<div className="flex items-center py-4">
								<input
									id="card"
									type="radio"
									defaultValue=""
									name="default-radio"
									className="w-[15px] sm:w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
									onChange={handleRadioChange}
								/>
								<label
									htmlFor="default-radio-1"
									className="text-xs sm:text-base ml-4 flex items-center gap-4 font-medium text-gray-900"
								>
									<CreditCardIcon className="w-[30px] sm:w-[30px] rounded" />
									Debit / Credit Card
								</label>
							</div>

							<div>
								{/*<div className="flex items-center py-4 border-t-4 border-gray-200">
              <input
                id="default-radio-1"
                type="radio"
                defaultValue=""
                name="default-radio"
                className="w-[15px] sm:w-[20px] aspect-square text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="default-radio-1"
                  className="text-xs sm:text-base ml-4 flex items-center gap-4 font-medium text-gray-900"
                >
                  <div className="w-[60px] sm:w-[100px] aspect-video bg-gray-100 rounded"></div>
                  PayPal Express Checkout <a href="#" className="text-blue-500 hidden sm:inline">What is PayPal?</a>
                </label>
                <a href="#" className="text-xs pl-4 mt-2 text-blue-500 block sm:hidden">What is PayPal?</a>
              </div>
            </div>*/}
								<div>
									<label
										htmlFor="message"
										className="block my-2 text-sm font-medium text-gray-900"
									>
										Do you have any comments regarding the
										order? <KeyboardArrowUpIcon />
									</label>
									<textarea
										id="message"
										rows={4}
										className="mt-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter your comment..."
										defaultValue={comment}
										onChange={(e) =>
											setComment(e.target.value)
										}
									/>

									{/* Modal */}
									<Modal
										isOpen={isModalOpen}
										onRequestClose={closeModal}
                    ariaHideApp={false}
										contentLabel="Checkout Modal"
                    portalClassName="modal"
									>
										<div id="checkout">
											{clientSecret && (
												<EmbeddedCheckoutProvider
													stripe={stripePromise}
													options={{ clientSecret }}
												>
													<EmbeddedCheckout />
												</EmbeddedCheckoutProvider>
											)}
										</div>
										<button
											className="closeModalBtn"
											onClick={closeModal}
										>
											Return to Cart
										</button>
									</Modal>

									<div className="w-full">
										{renderPaymentButton()}
									</div>
								</div>
							</div>
						</div>




                    
                    {/*checkout form #ends*/}
                       
                    </div>

                    <div className="cartSummary lg:w-[25%] md:w-[100%] ml-4">

                    <div className="bg-gray-50 p-3">

                      <div className="w-full font-bold mb-3">Order Summary </div>
                      <div className="w-full text-sm flex justify-between border-[1px] bg-yellow-50 border-gray-100 mb-2 column-layout p-3">
                        <div className="flex justify-between text-sm mb-2">
                            <div className="font-semibold">Cart Subtotal</div>
                            <div className="font-semibold">US${numeral(overallSum).format("0,0.00")}</div>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <div className="font-semibold">Insurance Fee</div>
                            <div className="font-semibold">US$0.00</div>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <div className="font-semibold">Shipping</div>
                            <div className="font-semibold">US$0.00</div>
                        </div>

                        </div>
                      <div className="w-full font-semibold text-sm flex justify-between border-b-[1px] border-gray-600 pb-2">
                        <span>{cartItems.length < 2 ? (
                          <p>{cartItems.length} item in cart</p>
                      ) : (
                          <p>{cartItems.length} items in cart</p>
                      )}
                      </span>

                      <KeyboardArrowDownOutlinedIcon />
                      
                      </div>

                      <div className="w-full text-sm flex justify-between">

                          <div className="cartRightDiv w-full">

                          {cartItems.map((item: VeeCartItem, index: number) => (
                       <div className="flex justify-between  w-full mb-3 mt-3" key={index}>
                        
                        <div className="summaryLeft flex lg:w-[70%]">
                        <Image
                            src={item.image_url} // Source of the image
                            alt={item.description} // Alternate text for accessibility
                            className="mr-2 w-[50px] h-[50px]" // Custom classes for styling
                            width={50} // Width of the image
                            height={50} // Height of the image
                          />
                            <div className="flex column-layout">
                              <div className="font-bold w-full">{item.ingramPartNumber}</div>
                              <div className="txt-smaller w-full"><b>Qty:</b> {item.quantity}</div>
                              <div className="txt-smaller w-full cursor-pointer"  onClick={() => toggleDetailsVisibility(index)}><KeyboardArrowDownOutlinedIcon /> View Details</div>
                              {detailsVisible[index] && 
                              <div className="flex column-layout">
                               <div className="font-semibold w-full text-sm">{item.description}</div>
                              </div>
                              }
                              

                            </div>
                        </div>
                        <div className="summaryRight font-bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.price * item.quantity)}
                     
                        </div>

                      
                       
                          </div>
                        ))}



                          </div>
                         

                      </div>
                      </div>
                      <div className="bg-gray-50 p-3 mt-3">
                      <div className="w-full font-semibold text-sm flex justify-between border-b-[1px] border-gray-200 pb-2">
                        <span>Ship To:</span>
                      <RoomOutlinedIcon />
                      
                      </div>
                      {!isLoggedIn && (
                        <>
                      <div className="w-full mt-1 txt-small">{retrievedData?.last_name} {retrievedData?.first_name}</div>
                      <div className="w-full mt-1 txt-small">{retrievedData?.company}</div>
                      <div className="w-full mt-1 txt-small">{retrievedData?.state}, {retrievedData?.city} {retrievedData?.zip}</div>
                      <div className="w-full mt-1 txt-small">{retrievedData?.country}</div>
                      <div className="w-full mt-1 txt-small">{retrievedData?.phone}</div>
                      </>
                      )}

                      {isLoggedIn && (
                        <>
                      <div className="w-full mt-1 txt-small">{myAddressInfo?.[0]?.nickname}</div>
                      <div className="w-full mt-1 txt-small">{myAddressInfo?.[0]?.company}</div>
                      <div className="w-full mt-1 txt-small">{myAddressInfo?.[0]?.state}, {myAddressInfo?.[0]?.city} {myAddressInfo?.[0]?.zip}</div>
                      <div className="w-full mt-1 txt-small">{myAddressInfo?.[0]?.country}</div>
                      <div className="w-full mt-1 txt-small">{myAddressInfo?.[0]?.phone}</div>
                      </>
                      )}






                      </div>


                    </div>
                </div>

            </div>
           
            <Footer />
        </div>
    );
};

export default PaymentComponent;
