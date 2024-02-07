
import React, { useState } from 'react';
import { useImage } from '@/providers/ImageContext'; 
import { Avatar } from "@nextui-org/react";
import Image from 'next/image';

const UploadImageComponent: React.FC = () => {
  const { uploadImage } = useImage();

  const { uploadedImage, uploadStatus, resetUploadStatus } = useImage();
  const [messageVisible, setMessageVisible] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hideMessage = () => {
    setMessageVisible(false);
    resetUploadStatus();
  };

  if (uploadStatus === 'uploading' || uploadStatus === 'success' || uploadStatus === 'error') {
    setTimeout(hideMessage, 8000);
  }

  return (
    <>
    <div className="upload-btn-wrapper">
      <div className="imgDiv"> 
      {uploadedImage && (
        <Avatar src={uploadedImage} className="w-10 h-10 text-tiny mr-2"  />
      )} Click to Update Profile Image</div>
    <input type="file" onChange={handleImageUpload} />
    </div>
      {uploadStatus === 'uploading' && <div className="w-full text-blue-400 flex justify-center font-bold">Uploading image...</div>}
      {uploadStatus === 'success' && <div className="w-full text-green-400 flex justify-center font-bold">Image uploaded successfully!</div>}
      {uploadStatus === 'error' && <div className="w-full text-red-400 flex justify-center font-bold">Failed to upload image.</div>}
    </>
  );
};

export default UploadImageComponent;
