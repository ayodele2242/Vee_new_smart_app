import React from 'react';

interface SelectElemProps {
  data: string[];
}

const SelectElem: React.FC<SelectElemProps> = ({ data, ...props }) => {
  return (
    <div className="p-1 bg-transparent border-black/50 border rounded-md">
      <select name="" id="" className="px-1 bg-transparent w-full" {...props}>
        {data.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectElem;
