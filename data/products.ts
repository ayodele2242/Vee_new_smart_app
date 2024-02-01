export type ProductsConfig = typeof productsConfig;
import bg2 from "@/public/images/bg2-removebg-preview.png";
import bg3 from "@/public/images/bgHome8-removebg-preview.png";
import bg4 from "@/public/images/bgHome9-removebg-preview.png";
import bg5 from "@/public/images/bgHome6-removebg-preview.png";
import bg6 from "@/public/images/bgHome7-removebg-preview.png";


export const productsConfig = {
	
	productsItems: [
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

        ]
   
	
};
