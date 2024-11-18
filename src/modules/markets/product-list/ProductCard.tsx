import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import React, { useState } from "react";
// import ProductImage from '@/assets/images/product1.jpg'
import { formatMoney, formatNumber, getImage, hasPermission } from "@/helpers";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createMarketCart, getMarketCart } from "@/api/market.service";
import { message } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchState, marketCartState, profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  primePrice: number;
  image: string;
  address: string;
  sold: number;
  imageCenter: {
    filePath: string;
  };
  product: {
    name: string;
    price: number;
  };
  discountPrice: number;
  quantitySold: number;
}

function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [marketCart, setMarketCart] = useRecoilState(marketCartState);
  const [cartStatus, setCartStatus] = useState<any>(null);

  const { mutate: mutateCreateCart, isLoading } = useMutation(
    (marketProductId) => {
      const payload = {
        marketProductId,
        quantity: 1,
      };
      return createMarketCart(payload);
    },
    {
      onSuccess: async (res) => {
        setCartStatus(new Date().getTime());
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const { data: marketCartRes, isLoading: isLoadingMarketCart } = useQuery(
    ["MARKET_CART", cartStatus],
    () => getMarketCart({}),
    {
      onSuccess: (res) => {
        setMarketCart(res?.data?.item);
      },
    },
  );

  return (
    <div className="shadow-md hover:shadow-xl transition-all rounded-[19px] overflow-hidden">
      <div
        className="w-full cursor-pointer relative flex"
        onClick={() => router.push(`/markets/products/${product?.id}`)}
      >
        <Image
          className="object-cover"
          height={190}
          width={272}
          src={product?.imageCenter?.path ? getImage(product?.imageCenter?.path) : product?.imageCenter?.filePath}
        />
        {product?.discountPrice > 0 && (
          <div className="absolute bottom-2 left-[14px] bg-[#2F80ED] rounded-[48px] px-3 text-base text-white py-1">
            Extra discount
          </div>
        )}
      </div>
      <div className="p-4 pb-5 flex flex-col gap-3">
        <h3
          className="text-base font-semibold line-clamp-1 cursor-pointer"
          onClick={() => {
            router.push(`/markets/products/${product?.id}`);
          }}
        >
          {product?.product?.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-red-main text-xl font-semibold">
            {formatMoney(product?.discountPrice > 0 ? product?.discountPrice : product?.price)}
          </span>
          {product?.discountPrice > 0 && (
            <span className="text-xl font-medium text-[#999999] line-through">{formatMoney(product?.price)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span>{product?.address || "Hà Nội"}</span>
          <span>Đã bán: {formatNumber(product?.quantitySold)}</span>
        </div>
        {hasPermission(profile?.role?.permissions, RoleModel.market_common, RoleAction.create) && (
          <CustomButton className="!h-12 !rounded-xl" outline onClick={() => mutateCreateCart(product?.id)}>
            Thêm vào giỏ hàng
          </CustomButton>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
