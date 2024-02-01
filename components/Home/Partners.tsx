// Import React and any other necessary dependencies
import React from 'react';
import {
  CiscoSvgIcon,
  MscSvgIcon,
  PaloaltoSvgIcon,
  VmWareSvgIcon,
  JuniperSvgIcon,
  ForcePointSvgIcon,
  YeaLinkSvgIcon,
  SplunkSvgIcon,
  CitrixSvgIcon,
  BarracudaSvgIcon,
} from '@/public/images/icons';

const svgIcons = [
  CiscoSvgIcon,
  MscSvgIcon,
  PaloaltoSvgIcon,
  VmWareSvgIcon,
  JuniperSvgIcon,
  ForcePointSvgIcon,
  YeaLinkSvgIcon,
  SplunkSvgIcon,
  CitrixSvgIcon,
  BarracudaSvgIcon,
];



const Partners: React.FC = () => {


  return (
    <section className=" px-5 py-10  z-50 relative">
      <h2 className=" font-semibold text-[1.3rem] text-center">
        Some of our Partners
      </h2>

      <div className=" flex flex-wrap  items-center justify-between">
        {svgIcons.map((Svg, i) => (
          <span key={i} className=" mr-3">
            <Svg />
          </span>
        ))}
      </div>
    </section>
  );
};


export default Partners;
