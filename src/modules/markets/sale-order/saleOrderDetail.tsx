import { getMarketOrderDetail } from "@/api/market.service";
import { branchState, profileState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { EOrderMarketStatusLabel } from "../type";
import { checkEndPrice, formatDateTime, formatMoney, formatNumber, getImage } from "@/helpers";
import Image from "next/image";
import StickyNoteIcon from "@/assets/stickynote.svg";
import { shipFee } from "../payment";
import GHNIcon from "@/assets/giaohangnhanh.svg";

function SaleOrderDetail() {
  const profile = useRecoilValue(profileState);
  const branchId = useRecoilValue(branchState);
  const router = useRouter();
  const { id } = router.query;

  const { data: orderDetail, isLoading } = useQuery(["ORDER_DETAIL", id], () => getMarketOrderDetail(id as string), {
    enabled: !!id,
  });
  const isSaleOrder = useMemo(() => {
    return router?.asPath?.split("/")[2] === "sale-order";
  }, [router?.asPath]);

  const totalMoney = useMemo(() => {
    return orderDetail?.data?.item?.products?.reduce((total, product) => {
      return (
        total +
        (product?.itemPrice ? product?.itemPrice : checkEndPrice(product?.discountPrice, product?.price)) *
          product?.quantity
      );
    }, 0);
  }, [orderDetail?.data?.item?.products]);

  return (
    <div className="bg-[#fafafc] min-h-screen">
      <div className="fluid-container">
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className="!text-red-main">
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Đơn hàng {isSaleOrder ? "bán" : "mua"}
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 mt-6 text-lg">
            <h4>
              Chi tiết đơn hàng <span className="text-lg">#{orderDetail?.data?.item?.code}</span>
            </h4>{" "}
            -{" "}
            <span className="text-[#3E7BFA] text-lg">
              {EOrderMarketStatusLabel[orderDetail?.data?.item?.status?.toUpperCase()]}
            </span>
          </div>
          <div className="text-[#666666]">
            Thời gian đặt hàng:{" "}
            <span className="text-[#242424]">{formatDateTime(orderDetail?.data?.item?.createdAt)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3  font-semibold mt-10 gap-10">
          <p className="text-base">Địa chỉ người nhận</p>
          <p className="text-base">Hình thức giao hàng</p>
          <p className="text-base">Hình thức thanh toán</p>
        </div>
        <div className="grid grid-cols-3 gap-10 mt-4">
          <div className="p-4 rounded-2xl bg-white">
            <p className="text-[#1C1C28] font-medium">{orderDetail?.data?.item?.fullName}</p>
            <p className="text-[#555770] mt-4">
              Địa chỉ: <span className="text-[#28293D]">{orderDetail?.data?.item?.address}</span>
            </p>
            <p className="text-[#555770]">
              Số điện thoại: <span className="text-[#28293D]">{orderDetail?.data?.item?.phone}</span>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white">
            <div className="flex items-center gap-3">
              <Image src={GHNIcon} />
              <span>Giao hàng nhanh</span>
            </div>
            <p>Giao hàng vào Thứ ba, 31/03</p>
            <p>Được giao bởi Giao Hàng Nhanh (giao từ Hà Nội)</p>
          </div>
          <div className="p-4 rounded-2xl bg-white">
            <p className="text-[#28293D]">Thanh toán khi nhận hàng</p>
          </div>
        </div>

        <div className="bg-white p-6 grid grid-cols-10 text-center font-semibold rounded mt-6 border-b-[6px] border-[#ECECEC]">
          <div className="col-span-4">Sản phẩm</div>
          <div className="col-span-2">Đơn giá</div>
          <div className="col-span-2">Số lượng</div>
          <div className="col-span-2">Tổng tiền</div>
        </div>
        <div className="bg-white border-b-[6px] border-[#ECECEC]">
          {orderDetail?.data?.item?.products?.map((product) => (
            <div className="p-[14px] grid grid-cols-10 text-center items-center" key={product?.id}>
              <div className="col-span-4 flex items-center gap-5">
                <Image
                  src={getImage(product?.marketProduct?.imageCenter?.path || product?.imageCenter?.path)}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg border-[1px] border-[#E4E4EB]"
                />
                <span className="text-base font-medium">{product?.marketProduct?.product?.name}</span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1">
                <span className="text-base text-[#28293D] font-medium">
                  {formatMoney(
                    product?.itemPrice ? product?.itemPrice : checkEndPrice(product?.discountPrice, product?.price),
                  )}
                </span>
              </div>
              <div className="col-span-2">{"x" + formatNumber(product?.quantity)}</div>
              <div className="col-span-2 text-red-main text-base font-medium">
                {formatMoney(
                  (product?.itemPrice ? product?.itemPrice : checkEndPrice(product?.discountPrice, product?.price)) *
                    product?.quantity,
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white">
          <div className="px-4">
            <div className="py-2">
              <div className="flex items-center gap-1">
                <Image src={StickyNoteIcon} />
                <span className="text-base font-medium ">Chi tiết thanh toán</span>
              </div>
              <div className="mt-[14px] flex flex-col gap-3">
                <div className="flex justify-between items-center font-medium">
                  <span>Tổng tiền hàng</span>
                  <span>{formatMoney(totalMoney)}</span>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span>Khuyến mại hóa đơn</span>
                  <span>{formatMoney(totalMoney - Number(orderDetail?.data?.item?.totalPrice))}</span>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span>Tổng tiền phí vận chuyển</span>
                  <span>{formatMoney(shipFee)}</span>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span className="text-base">Tổng thanh toán</span>
                  <span className="text-red-main text-xl font-semibold">
                    {formatMoney(Number(orderDetail?.data?.item?.totalPrice) + shipFee)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleOrderDetail;
