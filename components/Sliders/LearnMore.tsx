import React from "react";
import KeyboardDoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";

const LearnMore: React.FC = () => {
  return (
    <div className="h-[30px] md:h-[40px] w-[154px] font-[500] p-2 rounded-full cursor-pointer learnMoreBtn flex justify-center items-center text-white uppercase relative">
      <p className="hover:text-black pl-2">Learn More</p>
      {/*<p className="ml-[20px] md:ml-[30px]  hover:text-black pl-2">Learn More</p><div className="absolute left-0 top-0 bg-white h-[30px] w-[30px] md:h-[40px] md:w-[40px] rounded-full flex items-center justify-center  mr-2">
        <div className="w-[26px] md:w-[36px] h-[26px] md:h-[36px] border-dashed border-gray-400 z-40 border-[1px] rounded-full flex items-center justify-center">
          <KeyboardDoubleArrowRight
            sx={{
              color: "#D7AA12",
              fontSize: 20,
            }}
          />
        </div>
      </div>*/}
    </div>
  );
};

export default LearnMore;
