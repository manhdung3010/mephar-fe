import { checkProduct } from "@/api/market.service";
import { getImage } from "@/helpers";
import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import parse from "html-react-parser";

function CheckSeri() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product, isLoading } = useQuery(["CHECK_PRODUCT", id], () => checkProduct(id as string), {
    enabled: !!id,
  });
  return (
    <div>
      <title>Check sản phẩm</title>
      {isLoading ? (
        <div className="text-center text-2xl text-gray-400 min-h-screen flex justify-center items-center">
          <Spin />
        </div>
      ) : product?.data?.item ? (
        <div>
          <h4 className="text-center text-lg font-semibold my-4 uppercase">{product?.data?.item?.name}</h4>
          {product?.data?.item?.image?.path && (
            <div className="flex justify-center mb-5">
              <Image
                src={getImage(product?.data?.item?.image?.path)}
                alt={product?.data?.item?.name}
                width={160}
                height={160}
                objectFit="cover"
                className="!rounded-lg border border-gray-200 !overflow-hidden"
              />
            </div>
          )}
          <div>
            <div className="bg-[#fbecee] text-xl font-bold p-3">Mã truy xuất: {id}</div>
            <div className="">
              <div className="border-b border-gray-200 p-3">
                <span className="text-base font-medium">Mã vạch:</span>{" "}
                <span className="">{product?.data?.item?.barCode}</span>
              </div>
              <div className="border-b border-gray-200 p-3">
                <span className="text-base font-medium">Đại lý phân phối: </span>{" "}
                <span className="">{product?.data?.marketOrder?.customer?.fullName}</span>
              </div>
              <div className="border-b border-gray-200 p-3">
                <span className="text-base font-medium">Địa chỉ: </span>{" "}
                <span className="">
                  {product?.data?.marketOrder?.address}, {product?.data?.marketOrder?.ward?.name},{" "}
                  {product?.data?.marketOrder?.district?.name}, {product?.data?.marketOrder?.province?.name}
                </span>
              </div>
              <div className="border-b border-gray-200 p-3">
                <span className="text-base font-medium">Số điện thoại: </span>{" "}
                <span className="">{product?.data?.marketOrder?.phone}</span>
              </div>
              <div className="border-b border-gray-200 p-3">
                {parse(product?.data?.item?.description ?? "")}

                <div className="text-center mt-5">
                  <p className="text-gray-500">Đơn vị sản xuất và cung cấp sản phẩm</p>
                  <h3 className="text-xl font-semibold mt-5">{product?.data?.item?.store?.name}</h3>
                </div>
              </div>

              <div className="border-b border-gray-200 p-3">
                <span className="text-base font-medium">Địa chỉ:</span>{" "}
                <span className="">{product?.data?.item?.store?.address}</span>
              </div>
              <div className=" p-3 pb-10">
                <span className="text-base font-medium">Số điện thoại:</span>{" "}
                <span className="">{product?.data?.item?.store?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-2xl text-gray-400 min-h-screen flex justify-center items-center">
          Không tìm thấy sản phẩm
        </div>
      )}
    </div>
  );
}

export default CheckSeri;
