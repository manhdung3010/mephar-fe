import { Carousel } from "antd";
import React from "react";
import Banner1 from "@/assets/images/Banner 1.png";
import Banner2 from "@/assets/images/Banner 2.jpg";
import Banner3 from "@/assets/images/Banner 3.png";
import BannerTop from "@/assets/images/bannerTop.jpg";
import Image from "next/image";
import "swiper/css";

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

function MarketBanner() {
  return (
    <div className="fluid-container grid grid-cols-3 gap-5 py-7">
      <div className="col-span-2">
        <Carousel autoplay>
          <div>
            <Image src={BannerTop} height={280} width={792} objectFit="fill" className="rounded-2xl overflow-hidden" />
          </div>
          <div>
            <Image src={Banner3} height={280} width={792} objectFit="fill" className="rounded-2xl overflow-hidden" />
          </div>
        </Carousel>
      </div>
      <div className="col-span-1 flex flex-col gap-5">
        <Image src={Banner1} alt="" />
        <Image src={Banner2} alt="" />
      </div>
    </div>
  );
}

export default MarketBanner;
