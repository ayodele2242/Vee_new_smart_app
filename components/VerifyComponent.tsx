"use client"
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import { Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"
import Footer from './Home/Footer/Footer';
import { ApiRequestService } from '@/services/apiRequest.service';

interface ResponseDataItem {
    status: string;
    message: string;
    token: string
}

interface Props {
    verifyKey: string | null;
}

const VerifyComponent: React.FC<Props> = ({ verifyKey }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter();

    useEffect(() => {
        if (!verifyKey) return push("/register");

        const _init = async () => {
            setIsLoading(true);
            const data = { key: verifyKey };

            try {
                const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(data), "auth/activate_account");
               
                if (response.status === 200) {
                    const responseData = response.data;

                    if (responseData.status === false) {
                        toast.error("Error occurred: " + responseData.message);
                    } else{
                        toast.success(responseData.message);
                        setTimeout(function() {
                            push("/login");
                        }, 2000);
                    }
                } else if (response.status === 400) {
                    const responseData = response.data;
                    toast.error(responseData.message);
                }
            } catch (error) {
                console.error("An error occurred while activating account:", error);
                toast.error("An error occurred while activating account.");
            } finally {
                setIsLoading(false);
            }
        };

        _init();

        // Clean up any side effects
        return () => {
            // Clean up logic here if needed
        };
    }, [verifyKey, push]);

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    return (
        <div className="relative flex flex-col h-screen">
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} hideUserMenus={true} />
            <div className="mt-4"></div>
            <div className="w-full flex justify-center center sm:h-[100%] lg:h-[200px] p-5 bg-gray-100">
                <div className="w-full flex column-layout text-center font-bold gap-4 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
                    {isLoading ? (
                        <>
                            <Spinner />
                            <span>You will be redirected shortly...</span>
                        </>
                    ) : null}
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default VerifyComponent;
