"use client"

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
//import 'emoji-mart/css/emoji-mart.css';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './Home/Footer/Footer';
import { Navbar } from './navbar';
import Link from 'next/link';
import SideBar from './SideBar';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MessageComponent: React.FC = () => {
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [textareaHeight, setTextareaHeight] = useState<number | null>(null); // State to track textarea height
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for textarea element
    const socket = io('http://localhost:8080');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
       

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            if (chatEndRef.current) {
                // Check if the user is at the bottom before auto-scrolling
                const isUserAtBottom = chatEndRef.current.scrollHeight - chatEndRef.current.scrollTop === chatEndRef.current.clientHeight;
                if (isUserAtBottom) {
                    scrollToBottom();
                }
            }
        });

        return () => {
            // Cleanup function to close WebSocket connection when component unmounts
            if (socket) {
                socket.close();
            }
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            // Adjust the height of the textarea based on its content
            setTextareaHeight(textareaRef.current.scrollHeight > 200 ? 200 : textareaRef.current.scrollHeight);
        }
    }, [message]);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sendMessage = () => {
        if (message || file) {
            socket.emit('message', { message, file, date: selectedDate });
            setMessage('');
            setFile(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFile(file || null);
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessage(message + emoji.native);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        const isUserAtBottom = scrollHeight - scrollTop === clientHeight;

        if (isUserAtBottom && !loading) {
            setLoading(true);
            // Fetch previous messages
            // You can implement a function here to fetch previous messages from the server
        }
    };

    const handleUploadClick = () => {
        // Simulate click on file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        setTextareaHeight(e.target.scrollHeight > 200 ? 200 : e.target.scrollHeight);
    };


    const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
      };

    return (
        <div className="flex flex-col min-h-screen">
        <div
          className="flex-grow relative"
          style={{
            backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        >
         <Navbar onSelectedCategoriesChange={selectedSearchedItems} hideUserMenus={false}/>
          <div className="mt-4"></div>
          {/* Breadcrumbs */}
          <div className="mb-0 mt-1 flex w-full bg-white lg:pl-9 lg:pr-5 lg:pt-5 row-layout sm:p-4 md:p-4">
              <Link href="/" className="font-bold text-lg text-yellow-600  md:text-sm">Home</Link> 
              <KeyboardArrowRightOutlinedIcon  />
              <Link href="#" className="font-bold text-lg md:text-sm">Account</Link> 
              <KeyboardArrowRightOutlinedIcon />
              <Link href="#" className="font-bold text-lg md:text-sm">Messages</Link> 
          </div>
          <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
            <div className="flex gap-6 w-full">
              <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
                <SideBar />
              </div>
    
    
              <div className="content-div lg:w-3/4  bg-gray-100 rounded-xlg lg:m-5 sm:p-1">
    
              <div className="flex column-layout w-full sm:pb-3">
               
              
                <div className="w-full lg:p-0 relative">

                    No messages available at the moment

                    {/* <div className="chat-body" style={{ height: '40vh', overflowY: 'scroll' }} onScroll={handleScroll}>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            {msg.message} {msg.emoji && <span>{msg.emoji}</span>}{' '}
                            {msg.date && <span>{new Date(msg.date).toLocaleString()}</span>}
                        </div>
                    ))}
            <div ref={chatEndRef} />
            <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                style={{ height: textareaHeight ? `${textareaHeight}px` : 'auto' }}
            />
            <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
            <button onClick={sendMessage}>Send</button>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {showEmojiPicker ? 'Close Emoji Picker' : 'Open Emoji Picker'}
            </button>
            <span onClick={handleUploadClick} style={{ cursor: 'pointer' }}>Upload</span>
            {showEmojiPicker && (
                <Picker onSelect={handleEmojiSelect} style={{ position: 'absolute', bottom: '20px', right: '20px' }} />
            )}
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
        </div>*/}
                
                
                </div>
    
    
    
         
            </div>
    
             
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
};

export default MessageComponent;
