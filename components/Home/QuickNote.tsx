import React from 'react';

interface QuickNoteProps {
  title: string;
  onClick: () => void; // Adjust the type according to your onClick handler
}

const QuickNote: React.FC<QuickNoteProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick} className="h-[2.9rem] w-32 relative cursor-pointer mt-6">
      <div className="border-[3px] absolute border-l-transparent left-0 top-0 border-YELLOW_01 w-full h-full rounded-r-[1.9rem]"></div>
      <div className="absolute left-0 -top-1 -bottom-1 bg-white w-[80%]"></div>
      <div className="absolute left-2 bg-YELLOW_01 top-2 bottom-2 text-white right-[.34rem] flex justify-center items-center z-10 rounded-3xl">
        {title}
      </div>
    </div>
  );
};

export default QuickNote;
