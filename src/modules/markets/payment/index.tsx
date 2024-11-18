import React, { useEffect, useMemo, useState } from "react";
import MarkIcon from "@/assets/markRedIcon.svg";
import ArrowIcon from "@/assets/arrow-right-red.svg";
import Image from "next/image";
import StoreIcon from "@/assets/storeIcon.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchState, marketOrderDiscountState, paymentProductState, profileState } from "@/recoil/state";
import { checkEndPrice, formatMoney, formatNumber, getImage, sliceString } from "@/helpers";
import { CustomInput } from "@/components/CustomInput";
import StickyNoteIcon from "@/assets/stickynote.svg";
import { CustomButton } from "@/components/CustomButton";
import AddressModal from "./AddressModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createMarketOrder, getShipAddress } from "@/api/market.service";
import { message } from "antd";
import OrderModal from "./OrderModal";
import { DiscountOrderModal } from "./DiscountOrderModal";
import { cloneDeep } from "lodash";
import { EDiscountBillMethod, EDiscountGoodsMethod } from "@/modules/settings/discount/add-discount/Info";
import GiftIcon from "@/assets/gift.svg";
import { getProductDiscountList } from "@/api/discount.service";
import { ProductDiscountModal } from "./ProductDiscountModal";

export const shipFee = 50000;

function Payment() {
  const [paymentProduct, setPaymentProduct] = useRecoilState<any>(paymentProductState);
  const [openAddress, setOpenAddress] = useState(false);
  const [openOrderSuccess, setOpenOrderSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const branchId = useRecoilValue(branchState);
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [openMarketDiscountModal, setOpenMarketDiscountModal] = useState(false);
  const [openProductDiscountModal, setOpenProductDiscountModal] = useState(false);
  const [toStoreId, setToStoreId] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState<any>([]);
  const [selectedProductDiscount, setSelectedProductDiscount] = useState<any>([]);
  const [productUnitId, setProductUnitId] = useState<any>(null);
  const [storeIdSelect, setStoreIdSelect] = useState<any>(null);

  const { data: address } = useQuery(
    ["SHIP_ADDRESS", JSON.stringify({ page: 1, limit: 10, isDefaultAddress: 1, branchId })],
    () => getShipAddress({ page: 1, limit: 20 }),
    {
      onSuccess: (data) => {
        if (data?.data?.items) {
          setSelectedAddress(data?.data?.items[0]);
        }
      },
    },
  );

  useEffect(() => {
    const updateProductsDiscountList = async () => {
      if (paymentProduct?.length > 0) {
        const updatedProducts = await Promise.all(
          paymentProduct.map(async (store) => {
            const updatedStore = {
              ...store,
              products: await Promise.all(
                store.products.map(async (product) => {
                  const res = await getProductDiscountList(
                    {
                      productUnitId: product?.marketProduct?.productUnitId,
                      branchId: branchId,
                      quantity: product?.quantity,
                      toStoreId: store?.storeId,
                    },
                    EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER,
                    "ONLINE",
                  );
                  return {
                    ...product,
                    discountList: res?.data?.data?.items || [],
                  };
                }),
              ),
            };
            return updatedStore;
          }),
        );

        // Cập nhật state mới nếu cần
        setPaymentProduct(updatedProducts); // Giả sử bạn có một state lưu trữ `paymentProduct`
      }
    };

    updateProductsDiscountList();
  }, []);

  // Calculate total cost for all stores
  const totalMoney = useMemo(() => {
    return paymentProduct.reduce((total, store) => {
      const orderDiscountStore = selectedDiscount.find((item) => item.storeId === store.storeId);
      const discountType = orderDiscountStore?.items[0]?.apply?.discountType;
      const discountValue = orderDiscountStore?.items[0]?.apply?.discountValue;
      const storeTotal = store?.products?.reduce((storeSum, product) => {
        return (
          storeSum +
          (checkEndPrice(product?.discountPrice, product?.price) - (product?.discount ?? 0)) * product?.quantity
        );
      }, 0);
      if (discountType === "amount") {
        return total + storeTotal - discountValue;
      }
      if (discountType === "percent") {
        return total + storeTotal - (storeTotal * discountValue) / 100;
      }
      return total + storeTotal;
    }, 0);
  }, [selectedDiscount, paymentProduct]);

  const calculateDeliveryDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const deliveryDate = calculateDeliveryDate(3);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } = useMutation(
    () => {
      const payload = {
        orders: paymentProduct.map((store) => ({
          addressId: selectedAddress?.id,
          listProduct: store.products.map((product) => ({
            marketProductId: product?.marketProductId,
            quantity: product?.quantity,
            price: product?.discountPrice > 0 ? product?.discountPrice : product?.price,
            ...(product?.discountItem && {
              discountProductItemId: product?.discountItem?.items[0]?.id,
            }),
          })),
          note: paymentNote,
          toStoreId: store?.products[0]?.marketProduct?.storeId,
          discountOrderItemId: selectedDiscount.find((item) => item.storeId === store.storeId)?.items[0]?.id,
        })),
      };
      return createMarketOrder(payload);
    },
    {
      onSuccess: (data) => {
        setOrderInfo(data?.data?.item);
        setOpenOrderSuccess(true);
        setPaymentNote("");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateOrder();
  };

  const renderDiscount = (storeId) => {
    const d = selectedDiscount.find((item) => item.storeId === storeId);
    if (d?.type?.toUpperCase() === EDiscountBillMethod.ORDER_PRICE) {
      return `Giảm ${formatNumber(d?.items[0]?.apply?.discountValue)}${
        d?.items[0]?.apply?.discountType === "amount" ? "đ" : "%"
      }`;
    } else if (d?.type?.toUpperCase() === EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER) {
      return `Giảm ${formatNumber(d?.items[0]?.apply?.discountValue)}${
        d?.items[0]?.apply?.discountType === "amount" ? "đ" : "%"
      }`;
    }
    return "Chưa áp dụng khuyến mại";
  };

  return (
    <div className="bg-[#fafafc] text-[#28293D]">
      <div className="fluid-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className="!text-red-main">
              <span>Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li className="!text-red-main">
              <span>Giỏ hàng</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Thanh toán
              </a>
            </li>
          </ul>
        </nav>
        {/* Address Section */}
        <div className="bg-white my-4 p-6 border-t-4 border-[#FF3B3B] flex gap-2 items-center">
          <div className="w-3/4">
            <div className="flex items-center gap-1 text-red-main">
              <Image src={MarkIcon} />
              <span>Địa chỉ nhận hàng</span>
            </div>
            {selectedAddress && (
              <div className="mt-1 ml-7 text-[#28293D]">
                <p>
                  {selectedAddress?.fullName} | {selectedAddress?.phone}
                </p>
                <p>
                  {selectedAddress?.address}, {selectedAddress?.ward?.name}, {selectedAddress?.district?.name},{" "}
                  {selectedAddress?.province?.name}
                </p>
              </div>
            )}
          </div>
          <div className="w-1/4 flex justify-end">
            <Image src={ArrowIcon} className="cursor-pointer" onClick={() => setOpenAddress(true)} />
          </div>
        </div>

        {/* Product Section */}
        <div className="flex flex-col gap-5">
          {paymentProduct.map((store) => (
            <div key={store.storeId} className="bg-white round overflow-hidden">
              {/* Store Name */}
              <div className="flex items-center gap-1 p-6 border-b-[1px] border-[#E4E4EB] mt-4 text-[#333333] font-semibold">
                <Image src={StoreIcon} />
                {store.products[0]?.marketProduct?.store?.name}
              </div>
              {/* Products */}
              {store.products.map((product) => (
                <div className="p-[14px] grid grid-cols-10 text-center items-center" key={product?.id}>
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="flex-shrink-0 h-20 w-20">
                      <Image
                        src={
                          product?.marketProduct?.imageCenter?.path || product?.imageCenter?.path
                            ? getImage(product?.marketProduct?.imageCenter?.path || product?.imageCenter?.path)
                            : product?.marketProduct?.imageCenter?.filePath || product?.imageCenter?.filePath
                        }
                        width={80}
                        height={80}
                        className="object-cover rounded-lg border-[1px] border-[#E4E4EB]"
                      />
                    </div>
                    <p className="flex items-center gap-2">
                      <span className="text-base font-medium line-clamp-1">
                        {product?.marketProduct?.product?.name}
                      </span>
                      {product?.discountList?.length > 0 && (
                        <Image
                          src={GiftIcon}
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenProductDiscountModal(true);
                            setSelectedProductDiscount(product?.discountList);
                            setProductUnitId(product?.marketProduct?.productUnitId);
                            setStoreIdSelect(store.storeId);
                          }}
                        />
                      )}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <span
                      className={`text-base text-[#28293D] font-medium ${product?.discount > 0 ? "line-through" : ""}`}
                    >
                      {formatMoney(checkEndPrice(product?.discountPrice, product?.price))}
                    </span>
                    {product?.discount > 0 && (
                      <span className="text-red-main text-base font-semibold">
                        {formatMoney(checkEndPrice(product?.discountPrice, product?.price) - product?.discount)}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">{"x" + formatNumber(product?.quantity)}</div>
                  <div className="col-span-2 text-red-main text-base font-medium">
                    {formatMoney(
                      (checkEndPrice(product?.discountPrice, product?.price) - (product?.discount ?? 0)) *
                        product?.quantity,
                    )}
                  </div>
                </div>
              ))}

              {/* Shipping and Total */}
              <div className="bg-white">
                <div className="py-3 px-4 bg-[#E5FFFF]">
                  <div className="pb-3 border-b-[1px] border-[#00CFDE] text-base text-[#00B7C4] font-semibold">
                    Phương thức vận chuyển
                  </div>
                  <div className="pt-3 flex items-center">
                    <div className="w-3/4 flex flex-col">
                      <span className="font-semibold">Nhanh</span>
                      <span className="text-[#8F90A6]">Nhận hàng vào {deliveryDate}</span>
                    </div>
                    <div className="flex items-center w-1/4 justify-end">
                      {formatMoney(shipFee)}
                      <Image src={ArrowIcon} />
                    </div>
                  </div>
                </div>
                <div className="py-3 px-4 bg-[#E5FFFF] mt-2">
                  <div className="pb-3 border-b-[1px] border-[#00CFDE] text-base text-[#00B7C4] font-semibold">
                    Khuyến mại của shop
                  </div>
                  {
                    <div className="pt-3 flex items-center">
                      <div className="w-3/4 flex flex-col">
                        <span className="font-semibold">{renderDiscount(store.storeId)}</span>
                      </div>
                      <div className="flex items-center w-1/4 justify-end cursor-pointer">
                        <Image
                          src={ArrowIcon}
                          onClick={() => {
                            setOpenMarketDiscountModal(true);
                            setToStoreId(store.storeId);
                          }}
                        />
                      </div>
                    </div>
                  }
                </div>

                <div className="px-4 flex justify-between pt-2 pb-4 border-b-[1px] border-[#EBEBF0]">
                  <span className="text-base font-medium ">Tin nhắn</span>
                  <CustomInput
                    onChange={(value) => {
                      // update note for this store
                      const paymentClone = cloneDeep(paymentProduct);
                      const storeIndex = paymentClone.findIndex((item) => item.storeId === store.storeId);
                      paymentClone[storeIndex].note = value;
                      setPaymentProduct(paymentClone);
                    }}
                    value={store?.note}
                    placeholder="Lưu ý cho người bán"
                    className="!border-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Amount for All Stores */}
        <div className="bg-white mt-5">
          <div className="px-4 flex justify-between pt-4 pb-4">
            <span className="text-base font-medium ">
              Tổng số tiền ({formatNumber(paymentProduct.reduce((total, store) => total + store.products.length, 0))}{" "}
              sp)
            </span>
            <span className="text-red-main text-base font-medium">{formatMoney(totalMoney)}</span>
          </div>

          <div className="px-4">
            <div className="py-2 border-t-[6px] border-b-[6px] border-[#ECECEC]">
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
                  <span>Tổng tiền phí vận chuyển</span>
                  <span>{formatMoney(shipFee)}</span>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span className="text-base">Tổng thanh toán</span>
                  <span className="text-red-main text-xl font-semibold">{formatMoney(totalMoney + shipFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end my-4">
          <CustomButton
            className="!w-[300px] !h-[46px]"
            onClick={onSubmit}
            loading={isLoadingCreateOrder}
            disabled={isLoadingCreateOrder}
          >
            Đặt hàng
          </CustomButton>
        </div>
      </div>
      <AddressModal
        isOpen={openAddress}
        onCancel={() => setOpenAddress(false)}
        onSave={(selectedAddress) => setSelectedAddress(selectedAddress)}
        address={address?.data?.items}
      />
      <OrderModal
        isOpen={openOrderSuccess}
        onCancel={() => setOpenOrderSuccess(false)}
        orderInfo={orderInfo}
        totalMoney={totalMoney + shipFee}
      />
      <DiscountOrderModal
        isOpen={openMarketDiscountModal}
        onCancel={() => setOpenMarketDiscountModal(false)}
        onSave={(selectedDiscount, storeId) => {
          setSelectedDiscount((prev) => {
            const index = prev.findIndex((item) => item.storeId === storeId);
            if (index !== -1) {
              // Replace the item with the same storeId
              return [...prev.slice(0, index), selectedDiscount, ...prev.slice(index + 1)];
            } else {
              // Add the new selectedDiscount to the array
              return [...prev, selectedDiscount];
            }
          });
        }}
        customerId=""
        totalPrice={totalMoney}
        toStoreId={toStoreId}
        selectedDiscount={selectedDiscount}
      />

      <ProductDiscountModal
        isOpen={openProductDiscountModal}
        onCancel={() => setOpenProductDiscountModal(false)}
        onSave={(selectedDiscount, storeIdReceive, productUnitIdR) => {
          const fixPrice = selectedDiscount?.items[0]?.apply?.fixedPrice;
          const changeType = selectedDiscount?.items[0]?.apply?.changeType;
          // onSave(selectedDiscount, branchId);
          let paymentProductClone = cloneDeep(paymentProduct);
          paymentProductClone = paymentProductClone.map((item) => {
            if (item.storeId === storeIdReceive) {
              return {
                ...item,
                products: item.products.map((product) => {
                  if (product?.marketProduct?.productUnitId === productUnitIdR) {
                    return {
                      ...product,
                      discountItem: selectedDiscount,
                      discount:
                        changeType === "type_price"
                          ? checkEndPrice(product?.discountPrice, product?.price) - fixPrice
                          : fixPrice,
                    };
                  }
                  return product;
                }),
              };
            }
            return item;
          });
          setPaymentProduct(paymentProductClone);
        }}
        discountList={selectedProductDiscount}
        productUnitId={productUnitId}
        storeId={storeIdSelect}
      />
    </div>
  );
}

export default Payment;
