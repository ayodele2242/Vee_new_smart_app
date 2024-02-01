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
        VeeMost Technologies is a leading IT Products & Digital services
        provider. <br />
        Our edge is our experience and customer services.
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
