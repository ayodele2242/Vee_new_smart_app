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
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { faFilePdf, faFileWord, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ClearIcon from '@mui/icons-material/Clear';

const MessageComponent: React.FC = () => {
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [fileUrls, setFileUrls] = useState<{ url: string; extension: string; }[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [textareaHeight, setTextareaHeight] = useState<number | null>(null); // State to track textarea height
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for textarea element
    const socket = io('http://localhost:8080');
    const chatEndRef = useRef<HTMLDivElement>(null);
 
    const pickerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false); // Close the Picker if the click is outside
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const sendMessage = async () => {
        if (message || files.length > 0) {
            setLoading(true);

            const formData = new FormData();
            formData.append('message', message);

            files.forEach((file) => {
                formData.append('files', file);
            });

            try {
                // Send formData to the server
                // Example: const response = await axios.post('/api/messages', formData, {
                //     headers: { 'Content-Type': 'multipart/form-data' },
                //     onUploadProgress: (progressEvent) => {
                //         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                //         console.log(percentCompleted);
                //     },
                // });

                // Reset state after sending
                setMessage('');
                setFiles([]);
                setFileUrls([]);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
    
        // Extract file extensions from file names
        const urls = newFiles.map((file) => {
            const url = URL.createObjectURL(file);
            const extension = getFileExtension(file.name);
            return { url, extension };
        });
    
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setFileUrls((prevUrls) => [...prevUrls, ...urls]);
    };
    
    
    


    const handleFileDelete = (index: number) => {
        const updatedFiles = [...files];
        const updatedFileUrls = [...fileUrls];
        updatedFiles.splice(index, 1);
        updatedFileUrls.splice(index, 1);
        setFiles(updatedFiles);
        setFileUrls(updatedFileUrls);
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
        const { scrollHeight } = e.target;
        setTextareaHeight(scrollHeight > 100 ? 100 : scrollHeight);
    };

    const handleEmojiSelect = (emoji: any) => {
        if (textareaRef.current) {
            //console.log("Selected icon ",  emoji.native)
            const { selectionStart, selectionEnd } = textareaRef.current;
            const newMessage =
                message.substring(0, selectionStart) + emoji.native + message.substring(selectionEnd);
            setMessage(newMessage);
            textareaRef.current.focus();
        }
        
    };

    const getFileExtension = (fileName: string) => {
        console.log('fileName:', fileName);
    
        if (typeof fileName !== 'string' || !fileName.match) {
            //console.error('Invalid fileName:', fileName);
            return '';
        }
    
        const extensionMatch = fileName.match(/\.([^.]+)$/);
        return extensionMatch ? extensionMatch[1].toLowerCase() : '';
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
    
    
              <div className="content-div lg:w-3/4  bg-gray-100 rounded-xlg lg:m-5 sm:p-1  relative iChats">
    
              

                   

                     <div className="chat-body">
                        
                        <div className="messages-container w-full p-3">
                        {messages && messages.map((msg, index) => (
                            <div key={index}>
                                {msg.message}
                               
                            </div>
                        ))}
                        {!messages || (messages && messages.length === 0 && (
                            <div className="font-bold text-red-600">You do not have any message(s)</div>
                        ))}
                      
                        </div>




                        <div ref={chatEndRef} />
                        {fileUrls.length > 0 && (
                            <div className="mediaContainer w-full">
                               {fileUrls.map(({ url, extension }, index) => {
                                const fileExtension = extension; // Use the extension directly

                                return (
                                    <div key={index} className="mediaItem">
                                        {fileExtension === 'mp4' ? (
                                            <video controls src={url} className="mediaVideo" />
                                        ) : fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'webp' ? (
                                            <img src={url} alt="Uploaded file" className="mediaImage" />
                                        ) : fileExtension === 'pdf' ? (
                                            <FontAwesomeIcon icon={faFilePdf} className="mediaIcon" />
                                        ) : fileExtension === 'doc' || fileExtension === 'docx' ? (
                                            <FontAwesomeIcon icon={faFileWord} className="mediaIcon" />
                                        ) : fileExtension === 'xls' || fileExtension === 'xlsx' ? (
                                            <FontAwesomeIcon icon={faFileExcel} className="mediaIcon" />
                                        ) : (
                                            <InsertDriveFileIcon fontSize="large" />
                                        )}
                                        <button onClick={() => handleFileDelete(index)} className="delBtn"><ClearIcon className="txt-smaller" /></button>
                                    </div>
                                );
                            })}


                            </div>
                        )}
                        <div className="bottomDiv">
                        <div className="text-area-container w-full flex">
                        <button onClick={() => fileInputRef.current?.click()} className="iconBtn"><PermMediaIcon  /></button>
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleTextareaChange}
                                style={{
                                    height: textareaHeight ? `${textareaHeight}px` : '5px',
                                    overflowY: 'hidden', // Prevent flickering when typing and going to the next line
                                }}
                                placeholder="Write a message..."
                            ></textarea>
                            <input type="file" onChange={handleFileChange} ref={fileInputRef} multiple style={{ display: 'none' }} />
                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="iconBtn">
                                <TagFacesIcon/>
                            </button>
                            <button onClick={sendMessage} className="iconBtn sendBtn"><SendIcon /></button>

                           </div>
                           {showEmojiPicker && (
                           <div className="emojiContainer" ref={pickerRef}>
                                    <Picker onEmojiSelect={handleEmojiSelect} />
                           </div>
                           )}
                          
                            
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
