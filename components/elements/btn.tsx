import React from 'react';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Btn: React.FC<BtnProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`${className} px-4 py-1 border-black text-black`}
    >
      {children}
    </button>
  );
};

export default Btn;
