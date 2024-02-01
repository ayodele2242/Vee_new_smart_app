import React from 'react';
import { PersonOutline, ShoppingCartOutlined } from "@mui/icons-material";
import Link from "next/link";

interface ToCartProfileProps {
  isDarkIcon?: boolean;
}

const ToCartProfile: React.FC<ToCartProfileProps> = ({ isDarkIcon = false }) => {
  return (
    <div className="absolute right-0 bottom-0 top-0 flex gap-4 z-30">
      <Link href="/cart">
        <ShoppingCartOutlined
          sx={{
            fontSize: 40,
            color: `${isDarkIcon ? "#000000" : "#fff"}`,
          }}
          className="hover:text-[#D7AA12] cursor-pointer"
        />
      </Link>
      <Link href="/account/profile_settings">
        <PersonOutline
          sx={{
            fontSize: 40,
            color: `${isDarkIcon ? "#000" : "#fff"}`,
          }}
          className="hover:text-[#D7AA12] cursor-pointer"
        />
      </Link>
    </div>
  );
}

export default ToCartProfile;
