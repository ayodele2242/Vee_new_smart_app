export type SliderConfig = typeof sliderConfig;
import bg2 from "@/public/images/bg2-removebg-preview.png";
import bg3 from "@/public/images/bgHome8-removebg-preview.png";
import bg4 from "@/public/images/bgHome9-removebg-preview.png";
import bg5 from "@/public/images/bgHome6-removebg-preview.png";
import bg6 from "@/public/images/bgHome7-removebg-preview.png";

import bg_home_1 from "@/public/images/bgHome1.png";
import bg_home_5 from "@/public/images/bgHome5.png";
import bg_home_6 from "@/public/images/bgHome6.png";
import bg_home_7 from "@/public/images/bgHome7.png";
import bg_home_8 from "@/public/images/bgHome8.png";
import bg_home_9 from "@/public/images/bgHome9.png";
import bg_home_2 from "@/public/images/bgHome2.png";
import bg_home_3 from "@/public/images/bgHome3.png";
import bg_home_4 from "@/public/images/bgHome4.png";


export const sliderConfig = {
	
	sliderItems: [
        {
            id: 1,
            name: "Power Edge",
            image: bg2,
            price: "$10",
            type: ["Firewalls"],
          },
          {
            id: 2,
            name: "Router",
            image: bg6,
            price: "$10",
            type: ["Routers"],
          },
          {
            id: 3,
            name: "Monitor",
            image: bg3,
            price: "$10",
            type: ["Storage", "Wireless", "Servers"],
          },
          {
            id: 4,
            name: "Phone",
            image: bg4,
            price: "$10",
            type: ["Wireless", "Storage"],
          },
	],
    homeSliderItems: [
        {
            id: 1,
            isActive: true,
            isVisibleBackground: true,
            background: bg_home_1,
            title: "The smart store for digital transformation",
            desc: "Transform your business with our products and services.",
            isRightText: true,
          },
          {
            id: 2,
            isActive: false,
            isVisibleBackground: true,
            background: bg_home_2,
            title: "The smart store for digital transformation",
            desc: "Transform your business with our products and services.",
            position: "bg-top",
            isRightText: true,
          },
          {
            id: 3,
            isActive: false,
            isVisibleBackground: true,
            background: bg_home_3,
            title: "The smart store for digital transformation",
            desc: "Transform your business with our products and services.",
            position: "bg-top",
          },
          {
            id: 4,
            isActive: false,
            imageUrl: bg_home_4,
            title: "Accelerate your business",
            desc: "Shop Next-Generation and Legacy servers.\
            Select Servers and Specifications that meet your business needs or have us do the work for you.",
          },
          {
            id: 5,
            isActive: false,
            imageUrl: bg_home_5,
            title: "Secure your business",
            desc: "Buy new and refurbished Next Generation Firewalls to Secure your business operations, network and users.",
            isLeft: true,
          },
          {
            id: 6,
            isActive: false,
            imageUrl: bg_home_6,
            title: "Connect with confidence",
            desc: "Empower your network with reliable switches.",
          },
          {
            id: 7,
            isActive: false,
            imageUrl: bg_home_7,
            title: "Go wireless",
            desc: "Stay connected, stay productive - experience seamless wireless with our access points.",
            isLeft: true,
          },
          {
            id: 8,
            isActive: false,
            imageUrl: bg_home_8,
            title: "Work & play",
            desc: "Stay productive and kick back with desktop computers and laptops that meet your job and fun descriptions.",
          },
          {
            id: 9,
            isActive: false,
            imageUrl: bg_home_9,
            title: "Unified communications",
            desc: "Unified communications and collaboration endpoints at your fingertips",
            isLeft: true,
          },
	]
	
	
};
