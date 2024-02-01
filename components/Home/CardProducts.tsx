import React from 'react';
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface CardProductsProps {
  data: any;
}

const CardProducts: React.FC<CardProductsProps> = ({ data }) => {
  return (
    
    <Box
      className="flex flex-col justify-between relative md:min-h-[350px] rounded-xl bg-white overflow-hidden cursor-pointer active:scale-95 transition-transform duration-200"
      sx={{
        boxShadow:
          "0px 1.46249px 0.731243px -0.731243px rgba(0, 0, 0, 0.2), 0px 0.731243px 0.731243px rgba(0, 0, 0, 0.14), 0px 0.731243px 2.19373px rgba(0, 0, 0, 0.12)",
      }}
    >
      {data?.image && (
        <div className="w-full md:h-[200px] overflow-hidden p-3">
          <Image
            src={data?.image}
            alt={data.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      <div className="min-h-[75px] flex flex-col justify-between px-2 sm:px-10 py-2 sm:py-8">
        <Typography
          className="cursor-pointer text-center sm:text-[24px] font-bold font-primary transition-colors duration-200"
        >
          {data.name}
        </Typography>
        <Typography
          className="text-center cursor-pointer text-[14px] transition-colors duration-200"
        >
          {data?.price}
        </Typography>
      </div>
    </Box>

  );
};

export default CardProducts;
