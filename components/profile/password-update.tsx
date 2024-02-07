"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ApiRequestService } from '@/services/apiRequest.service';
import { toast } from 'react-toastify';


interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
  }
  

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
 

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiRequestService.callAPI<ResponseDataItem>(
        { password },
        'auth/updatePassword'
      );
      if (response.status === 200) {
        const responseData = response.data;

        toast.success('Password updated successfully.');
       
      } else {
        toast.error('Failed to update password.');
      }
    } catch (error) {
      toast.error('An error occurred while updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-6  rounded-lg shadow-lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        handlePasswordUpdate();
      }}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
