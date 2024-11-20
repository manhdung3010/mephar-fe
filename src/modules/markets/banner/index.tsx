import { Carousel } from "antd";
import React, { useState } from "react";
import Banner1 from "@/assets/images/Banner 1.png";
import Banner3 from "@/assets/images/Banner 3.png";
import BannerTop from "@/assets/images/bannerTop.png";
import Image from "next/image";
import "swiper/css";
import { useQuery } from "@tanstack/react-query";
import { getBanner } from "@/api/market.service";
import { getImage } from "@/helpers";
import MarketBannerSkeleton from "./MarketBannerSkeleton";

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

function MarketBanner() {
  const [listBanner, setListBanner] = useState([]);
  const [moreImg, setMoreImg] = useState([]);

  const { data: banners, isLoading } = useQuery(["MARKET_BANNER", 1], () => getBanner(), {
    onSuccess: (data) => {
      setListBanner(data.data?.list_banner?.filter((item) => item?.type === "banner"));
      setMoreImg(data.data?.list_banner?.filter((item) => item?.type === "moreImg"));
    },
  });

  if (isLoading) {
    return <MarketBannerSkeleton />;
  }
  return (
    <div className="fluid-container grid grid-cols-3 gap-5 py-7">
      <div className="col-span-2">
        <Carousel autoplay>
          {listBanner?.map((item: any, index) => (
            <div key={item?.id}>
              <Image
                src={getImage(item?.image?.path)}
                height={280}
                width={792}
                objectFit="fill"
                className="rounded-2xl overflow-hidden"
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="col-span-1 flex flex-col gap-5">
        {moreImg?.map((item: any, index) => (
          <Image
            key={item?.id}
            src={getImage(item?.image?.path)}
            height={130}
            width={380}
            objectFit="fill"
            className="rounded-2xl overflow-hidden"
          />
        ))}
      </div>
    </div>
  );
}

export default MarketBanner;
