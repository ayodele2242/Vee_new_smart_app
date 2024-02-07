"use client"


import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ApiRequestService } from '@/services/apiRequest.service';

interface ImageContextProps {
  uploadedImage: string | null;
  uploadImage: (imageData: string | null) => void;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  resetUploadStatus: () => void;
}

interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
  }

const ImageContext = createContext<ImageContextProps>({
  uploadedImage: null,
  uploadImage: () => {},
  uploadStatus: 'idle',
  resetUploadStatus: () => {},
});

export const useImage = (): ImageContextProps => useContext(ImageContext);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      setUploadedImage(storedImage);
    }
  }, []);

  const uploadImage = async (imageData: string | null) => {
    if (!imageData) return;

    setUploadStatus('uploading');

    try {

      
         const  payload = {
            image: imageData,
          };

        const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), 'auth/update_image');
        const responseData = response.data;

        if (response.status === 200) {
            const { status, message, data } = responseData;
            setUploadedImage(imageData);
            localStorage.setItem('uploadedImage', imageData);
            setUploadStatus('success');
                        
        } else {
            throw new Error('Upload failed');  
        }

    }catch (error) {
        console.error('Error uploading profile picture:', error);
        setUploadStatus('error');
      }

   
  };

  const resetUploadStatus = () => {
    setUploadStatus('idle');
  };

  return (
    <ImageContext.Provider value={{ uploadedImage, uploadImage, uploadStatus, resetUploadStatus }}>
      {children}
    </ImageContext.Provider>
  );
};
