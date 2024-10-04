import React, { useCallback, useMemo, useState } from "react";
import Logo from "@/assets/whiteLogo.svg";
import MenuMarket1 from "@/assets/menuMarket1.svg";
import MenuMarket2 from "@/assets/menuMarket2.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import CartIcon from "@/assets/marketCartIcon.svg";
import NotificationIcon from "@/assets/notificationIcon.svg";
import Image from "next/image";
import { CustomInput } from "@/components/CustomInput";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchState, marketCartState, profileState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { getConfigProduct, getMarketCart } from "@/api/market.service";
import { formatNumber, sliceString } from "@/helpers";
import { Tooltip } from "antd";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { debounce } from "lodash";
import OrderListModal from "./OrderListModal";

function MarketHeader() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [marketCart, setMarketCart] = useRecoilState(marketCartState);
  const [tempKeyword, setTempKeyword] = useState("");
  const [openOrderList, setOpenOrderList] = useState(false);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 16,
    keyword: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: "common",
  });

  const { data: configProduct, isLoading } = useQuery(
    ["CONFIG_PRODUCT", JSON.stringify(formFilter), branchId],
    () => getConfigProduct({ ...formFilter }),
    {
      enabled: tempKeyword === "" ? false : true,
    },
  );

  const totalItem = useMemo(() => {
    return marketCart?.reduce((total, item) => total + item?.products?.length, 0);
  }, [marketCart]);

  // Search product
  const onSearch = useCallback(
    debounce((value) => {
      setFormFilter({
        ...formFilter,
        keyword: value,
      });
    }, 300),
    [tempKeyword],
  );

  return (
    <div className="bg-[#D64457]">
      <div className="fluid-container grid grid-cols-12 gap-x-6 items-center py-5">
        <div className="col-span-2 cursor-pointer" onClick={() => router.push("/markets")}>
          <Image src={Logo} alt="logo" />
        </div>
        <div className="col-span-6">
          <CustomInput
            className="h-[54px] rounded-xl"
            prefixIcon={<Image src={SearchIcon} />}
            placeholder="Tìm kiếm sản phẩm"
            onChange={(value) => {
              // router.push('/markets/search?keyword=' + value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push("/markets/search?keyword=" + e.target.value);
              }
            }}
          />
        </div>
        <div className="col-span-4 flex items-center gap-10">
          <div className="flex items-center  gap-6">
            <div
              className="w-[54px] h-[54px] bg-[#FFE5E5] rounded-[18px] flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/markets/stores")}
            >
              <Tooltip placement="bottom" title="Cửa hàng">
                <Image src={MenuMarket1} />
              </Tooltip>
            </div>
            <div
              className="w-[54px] h-[54px] bg-[#FFE5E5] rounded-[18px] flex justify-center items-center cursor-pointer"
              onClick={() => setOpenOrderList(true)}
            >
              <Tooltip placement="bottom" title="Đơn hàng">
                <Image src={MenuMarket2} />
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer flex-shrink-0" onClick={() => router.push("/markets/cart")}>
              <Image src={CartIcon} />
              <span className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-white text-red-main grid place-items-center">
                {formatNumber(totalItem)}
              </span>
            </div>
            <div className="flex-shrink-0">
              <Image src={NotificationIcon} />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="rounded-full w-6 h-6 overflow-hidden border-[1px] border-[#efb4bc] grid place-items-center">
                <Image src={profile?.avatar?.pathName || Logo} />
              </div>
              <h4 className="font-medium text-white">{sliceString(profile?.store?.name, 15)}</h4>
            </div>
          </div>
        </div>
      </div>
      <OrderListModal isOpen={openOrderList} onCancel={() => setOpenOrderList(false)} />
    </div>
  );
}

export default MarketHeader;
