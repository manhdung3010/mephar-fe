import { Skeleton } from "antd";
import React from "react";

function MarketBannerSkeleton() {
  return (
    <div className="fluid-container grid grid-cols-3 gap-5 py-7">
      <div className="col-span-2 h-[280px]">
        <Skeleton.Image active rootClassName=" !w-full !h-full" className="!w-full !h-full" />
      </div>
      <div className="col-span-1 flex flex-col gap-5">
        <Skeleton.Image active rootClassName=" !w-full !h-full" className="!w-full !h-full" />
        <Skeleton.Image active rootClassName=" !w-full !h-full" className="!w-full !h-full" />
      </div>
    </div>
  );
}

export default MarketBannerSkeleton;
