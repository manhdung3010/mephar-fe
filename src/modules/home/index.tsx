import { Avatar } from "antd";
import Image from "next/image";

import ArrowDownIcon from "@/assets/arrow-down.svg";
import DollarIcon from "@/assets/dolarIcon.svg";
import DoubleBackIcon from "@/assets/doubleBackIcon.svg";

import { BestSellerProductChart } from "./BestSellerProductChart";
import { RevenueChart } from "./RevenueChart";
import { useRecoilValue } from "recoil";
import { branchGenegalState, branchState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { getSaleReport } from "@/api/report.service";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getOrder, getSaleReturn } from "@/api/order.service";
import { formatMoney, formatNumber, timeAgo } from "@/helpers";
import { getUserLog } from "@/api/user";
import { generalId } from "@/layouts/Header";

export enum FilterDateType {
  CURRENT_MONTH = 1,
  PRE_MONTH = 2,
}

export enum ProductViewType {
  Date = "date",
  Day = "day",
}

export function Home() {
  const branchId = useRecoilValue(branchState);
  const [totalReturn, setTotalReturn] = useState(0);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    dateRange: JSON.stringify({
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    }),
    status: undefined,
  });

  const [userFilter, setUserFilter] = useState({
    page: 1,
    limit: 20,
  });
  const [saleReturnFilter, setSaleReturnFilter] = useState({
    page: 1,
    limit: 9999,
    from: dayjs().startOf("month"),
    to: dayjs().endOf("month"),
  });

  const { data: orders, isLoading } = useQuery(["ORDER_LIST", JSON.stringify(formFilter), branchId, generalId], () =>
    getOrder({
      ...formFilter,
      ...(branchId === generalId ? {} : { branchId }),
    }),
  );
  const { data: saleReturn, isLoading: isLoadingSaleReturn } = useQuery(
    ["SALE_RETURN_LIST", JSON.stringify(saleReturnFilter), branchId, generalId],
    () =>
      getSaleReturn({
        ...formFilter,
        ...(branchId === generalId ? {} : { branchId }),
      }),
  );
  const { data: userLog, isLoading: isLoadingUserLog } = useQuery(
    ["USER_LOG", JSON.stringify(userFilter), branchId, generalId],
    () =>
      getUserLog({
        ...userFilter,
        ...(branchId === generalId ? {} : { branchId }),
      }),
  );
  const type = {
    order: "bán hàng",
    sale_return: "trả hàng",
    inbound: "nhập hàng",
    purchase_return: "trả hàng nhập",
    inventory_checking: "kiểm kho",
    move: "chuyển hàng",
    receive: "nhận hàng",
  };

  useEffect(() => {
    if (saleReturn?.data?.items) {
      const total = saleReturn?.data?.items.reduce((acc, item) => acc + item?.totalPrice, 0);
      setTotalReturn(total);
    }
  }, [saleReturn?.data?.items]);

  return (
    <div className="gap-x-6 py-6">
      <div className="col-span-3 ">
        <div className="mb-6 rounded-sm bg-white p-5">
          <div className="mb-3 font-bold text-[#15171A]">Kết quả bán hàng hôm nay</div>

          <div className="flex gap-x-6">
            <div className="flex ">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#56BD79]">
                <Image src={DollarIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">{formatNumber(orders?.data?.totalItem)} Hóa đơn</div>
                <div className="text-[22px] text-[#56BD79]">{formatMoney(+orders?.data?.totalPrice)}</div>
                <div className="text-xs text-[#525D6A]">Doanh thu</div>
              </div>
            </div>

            <div className="flex border-x border-[#E1E3E6] px-6">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
                <Image src={DoubleBackIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">{formatNumber(saleReturn?.data?.totalItem)} Hóa đơn</div>
                <div className="text-[22px] text-[#FF8800]">{formatMoney(totalReturn)}</div>
                <div className="text-xs text-[#525D6A]">Trả hàng</div>
              </div>
            </div>

            {/* <div className="flex">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ED232F]">
                <Image src={ArrowDownIcon} alt="" />
              </div>

              <div>
                <div className="mt-4 text-[22px] text-[#ED232F]">-30.20%</div>
                <div className="text-xs text-[#525D6A]">
                  So với cùng kỳ tháng trước
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="mb-6 bg-white p-5">
          <RevenueChart branchId={branchId} />
        </div>
      </div>
    </div>
  );
}
