// Import React and any other necessary dependencies
import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { TwitterSvgIcon } from '@/public/images/icons';

const socialLinks = [
  { 
    id: '1',
    link: 'https://facebook.com/veemost/',
    icon: <FacebookIcon fontSize="large" />,
  },
  {
    id: '2',
    link: '#',
    icon: <InstagramIcon fontSize="large" />,
  },
  {
    id: '3',
    link: 'https://twitter.com/veemost/',
    icon: <TwitterSvgIcon />,
  },
  {
    id: '4',
    link: '#',
    icon: <YouTubeIcon fontSize="large" />,
  },
  {
    id: '5',
    link: 'https://www.linkedin.com/company/veemost-technologies',
    icon: <LinkedInIcon fontSize="large" />,
  },
];


// Define the About component
const About: React.FC = () => {
  return (
    <section className="px-5 py-10 z-50 relative">
      <h2 className=" font-bold text-[1.6rem] drop-shadow-lg">About Us</h2>
      <p className="mt-3 text-[1.1rem] font-semibold">
      Discover VeeMost Smart Store - your premier destination for digital transformation solutions and IT products. 
      Explore our online smart store for a curated selection of IT products and hardware at unbeatable prices. </p>
      <p className="mt-1 text-[1.1rem] font-semibold">
      Experience convenience and quality with our wide range of software solutions, licensing, networking equipment, 
      and cutting-edge hardware. Trust VeeMost for your digital needs and elevate your business today. 
      </p>
      <p className="mt-1 text-[1.1rem] font-semibold">
      With industry-leading partnerships and expertise, we also specialize in architecting, deploying, and managing secure digital platforms. From consultation to lifecycle management, we provide end-to-end support, ensuring efficiency and profitability for your business.
      </p>
      <h2 className=" font-bold text-[1.2rem] mt-5">Contact Us</h2>
      <div className=" space-y- ">
        <p className='text-[1.1rem] font-semibold'>info@veemost.com</p>
        <p className='text-[1.1rem] font-semibold'>sales@veemost.com</p>
        <p className='text-[1.1rem] font-semibold'>+1-732.532.1180</p>
      </div>
      <h2 className=" font-bold text-[1.2rem] mt-5">Follow Us</h2>

      <p className="mb-3 text-[1.1rem] font-semibold">blog.veestore.com</p>
      <div className="flex items-center space-x-4 ">
        {socialLinks.map(({ id, link, icon }) => (
          <div key={id}>
          <a  href={link} target="blank">
            <span className=" ">{icon}</span>
          </a>
          </div>
        ))}
      </div>
    </section>
  );
};

// Export the About component
export default About;
