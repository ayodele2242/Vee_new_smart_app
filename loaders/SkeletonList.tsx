import React from 'react';
import {Skeleton} from "@nextui-org/react";

interface SkeletonListProps {
  numberOfItems: number;
}

const SkeletonList: React.FC<SkeletonListProps> = ({ numberOfItems }) => {
  const skeletons = Array.from({ length: numberOfItems }, (_, index) => (
    <Skeleton key={index} className="w-4/5 rounded-lg space-y-3 mb-3">
      <div className={`h-3 w-4/5 rounded-lg bg-default-${index % 2 === 0 ? '200' : '300'}`}></div>
    </Skeleton>
  ));

  return <>{skeletons}</>;
};

export default SkeletonList;
