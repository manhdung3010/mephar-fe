import { Avatar } from "antd";
import Image from "next/image";

import ArrowDownIcon from "@/assets/arrow-down.svg";
import DollarIcon from "@/assets/dolarIcon.svg";
import DoubleBackIcon from "@/assets/doubleBackIcon.svg";

import { BestSellerProductChart } from "./BestSellerProductChart";
import { RevenueChart } from "./RevenueChart";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { getSaleReport } from "@/api/report.service";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getOrder, getSaleReturn } from "@/api/order.service";
import { formatMoney, formatNumber, timeAgo } from "@/helpers";
import { getUserLog } from "@/api/user";

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
    branchId,
  });

  const [userFilter, setUserFilter] = useState({
    page: 1,
    limit: 20,
    branchId,
  });
  const [saleReturnFilter, setSaleReturnFilter] = useState({
    page: 1,
    limit: 9999,
    from: dayjs().startOf("month"),
    to: dayjs().endOf("month"),
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ["ORDER_LIST", JSON.stringify(formFilter), branchId],
    () => getOrder({ ...formFilter, branchId })
  );
  const { data: saleReturn, isLoading: isLoadingSaleReturn } = useQuery(
    ["SALE_RETURN_LIST", JSON.stringify(saleReturnFilter), branchId],
    () => getSaleReturn({ ...formFilter, branchId })
  );
  const { data: userLog, isLoading: isLoadingUserLog } = useQuery(
    ["USER_LOG", JSON.stringify(userFilter), branchId],
    () => getUserLog({ ...userFilter, branchId })
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
      const total = saleReturn?.data?.items.reduce(
        (acc, item) => acc + item?.totalPrice,
        0
      );
      setTotalReturn(total);
    }
  }, [saleReturn?.data?.items]);

  return (
    <div className="grid grid-cols-4 gap-x-6 py-6">
      <div className="col-span-3 ">
        <div className="mb-6 rounded-sm bg-white p-5">
          <div className="mb-3 font-bold text-[#15171A]">
            Kết quả bán hàng hôm nay
          </div>

          <div className="flex gap-x-6">
            <div className="flex ">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#56BD79]">
                <Image src={DollarIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">
                  {formatNumber(orders?.data?.totalItem)} Hóa đơn
                </div>
                <div className="text-[22px] text-[#56BD79]">
                  {formatMoney(+orders?.data?.totalPrice)}
                </div>
                <div className="text-xs text-[#525D6A]">Doanh thu</div>
              </div>
            </div>

            <div className="flex border-x border-[#E1E3E6] px-6">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
                <Image src={DoubleBackIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">
                  {formatNumber(saleReturn?.data?.totalItem)} Hóa đơn
                </div>
                <div className="text-[22px] text-[#FF8800]">
                  {formatMoney(totalReturn)}
                </div>
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

        <div className="mb-6 bg-white p-5">
          <BestSellerProductChart branchId={branchId} />
        </div>
      </div>

      <div className=" col-span-1 bg-white py-5">
        <div className="ml-5 border-b border-[#E1E3E6] pb-4 font-bold text-[#15171A]">
          Các hoạt động gần đây
        </div>

        <div className="px-5 pt-5">
          {userLog?.data?.items.map((value) => (
            <div className="flex h-fit gap-x-5" key={value?.id}>
              <div className="flex flex-col items-center">
                <Avatar style={{ background: "#4285F4" }} size={32}>
                  {value?.createdBy?.fullName[0]}
                </Avatar>
                {value !== 19 && (
                  <div className="w-[1px] grow bg-[#E1E3E6]"></div>
                )}
              </div>

              <div className="mb-5">
                <div>
                  <span className="text-[#0070F4]">
                    {value?.createdBy?.fullName}
                  </span>
                  <span className="mx-2">vừa</span>
                  <span className="text-[#0070F4]">{type[value?.type]}</span>
                </div>
                {(value?.type !== type["inventory_checking"] || value?.type !== type['receive']) && (
                  <div>
                    với giá trị{" "}
                    <span className="font-bold">
                      {formatMoney(value?.amount)}
                    </span>
                  </div>
                )}

                <div className="italic text-[#525D6A]">
                  {timeAgo(value?.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
