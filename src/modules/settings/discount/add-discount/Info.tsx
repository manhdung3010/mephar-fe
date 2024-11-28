import { Checkbox } from "antd";
import Image from "next/image";
import { useState } from "react";

import InfoIcon from "@/assets/info-circle.svg";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";

import InputError from "@/components/InputError";
import { BillDiscount } from "./bill-target/BillDiscount";
import { BillDiscountProduct } from "./bill-target/BillDiscountProduct";
import { BillGiftPoint } from "./bill-target/BillGiftPoint";
import { BillGiftProduct } from "./bill-target/BillGiftProduct";
import { ProductDiscountProduct } from "./product-target/ProductDiscountProduct";
import { ProductGiftProduct } from "./product-target/ProductGiftProduct";
import { ProductGiftPoint } from "./product-target/ProductGiftPoint";
import { ProductQuantity } from "./product-target/ProductQuantity";
import { ProductGiftProductAndPoint } from "./product-target/ProductGiftProductAndPoint";

export enum EDiscountType {
  ORDER = "ORDER",
  PRODUCT = "PRODUCT",
}

export enum EDiscountTypeLabel {
  ORDER = "Hóa đơn",
  PRODUCT = "Hàng hóa",
}

export enum EDiscountBillMethod {
  ORDER_PRICE = "ORDER_PRICE",
  PRODUCT_PRICE = "PRODUCT_PRICE",
  GIFT = "GIFT",
  LOYALTY = "LOYALTY",
}

export enum EDiscountBillMethodLabel {
  GIFT = "Tặng hàng",
  ORDER_PRICE = "Giảm giá hóa đơn",
  PRODUCT_PRICE = "Giảm giá hàng",
  LOYALTY = "Tặng điểm",
}

export enum EDiscountGoodsMethod {
  PRODUCT_PRICE = "PRODUCT_PRICE",
  GIFT = "GIFT",
  LOYALTY = "LOYALTY",
  PRICE_BY_BUY_NUMBER = "PRICE_BY_BUY_NUMBER",
  GIFT_AND_POINT = "GIFT_AND_POINT",
}

export enum EDiscountGoodsMethod111 {
  PRODUCT_PRICE = "PRODUCT_PRICE",
  GIFT = "GIFT",
  LOYALTY = "LOYALTY",
}

export enum EDiscountGoodsMethodLabel {
  PRODUCT_PRICE = "Mua hàng giảm giá hàng",
  GIFT = "Mua hàng tặng hàng",
  LOYALTY = "Mua hàng tặng điểm",
}

export enum EDiscountUnit {
  MONEY = "AMOUNT",
  PERCENT = "PERCENT",
}

export const orderOptionData = [
  {
    value: EDiscountBillMethod.ORDER_PRICE,
    label: EDiscountBillMethodLabel.ORDER_PRICE,
  },
  {
    value: EDiscountBillMethod.PRODUCT_PRICE,
    label: EDiscountBillMethodLabel.PRODUCT_PRICE,
  },
  {
    value: EDiscountBillMethod.GIFT,
    label: EDiscountBillMethodLabel.GIFT,
  },
  {
    value: EDiscountBillMethod.LOYALTY,
    label: EDiscountBillMethodLabel.LOYALTY,
  },
];

export const productOptionData = [
  {
    value: EDiscountGoodsMethod.PRODUCT_PRICE,
    label: EDiscountGoodsMethodLabel.PRODUCT_PRICE,
  },
  {
    value: EDiscountGoodsMethod.GIFT,
    label: EDiscountGoodsMethodLabel.GIFT,
  },
  {
    value: EDiscountGoodsMethod.LOYALTY,
    label: EDiscountGoodsMethodLabel.LOYALTY,
  },
  {
    value: EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER,
  },
];

const Info = ({ setValue, getValues, errors }: any) => {
  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl font-medium text-[#999]">THÔNG TIN</h2>

      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã chương trình" />
          <CustomInput
            placeholder="Mã tự động"
            className="h-11"
            onChange={(value) => setValue("code", value, { shouldValidate: true })}
            value={getValues("code")}
          />
          <InputError error={errors.code?.message} />
        </div>

        <div>
          <Label infoText="" label="Trạng thái" />
          <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
            <CustomRadio
              options={[
                { value: "active", label: "Kích hoạt" },
                { value: "inactive", label: "Chưa áp dụng" },
              ]}
              onChange={(value) => setValue("status", value, { shouldValidate: true })}
              value={getValues("status")}
            />
          </div>
        </div>

        <div>
          <Label infoText="" label="Tên chương trình" required />
          <CustomInput
            placeholder="Tên chương trình khuyến mại"
            className="h-11"
            onChange={(value) => setValue("name", value, { shouldValidate: true })}
            value={getValues("name")}
          />
          <InputError error={errors.name?.message} />
        </div>

        <div>
          <Label infoText="" label="Ghi chú" />
          <CustomInput
            placeholder="Ghi chú"
            className="h-11"
            onChange={(value) => setValue("note", value, { shouldValidate: true })}
            value={getValues("note")}
          />
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium uppercase text-[#999]">hình thức khuyến mại</h2>

      <div
        className="grid grid-cols-2 gap-x-[42px] gap-y-5"
        style={{
          gridTemplateColumns:
            getValues("target") === EDiscountType.ORDER ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
        }}
      >
        <div>
          <Label infoText="" label="Khuyến mại theo" />
          <CustomSelect
            onChange={(value) => {
              setValue("target", value, { shouldValidate: true });
              value === "PRODUCT" && setValue("type", "PRODUCT_PRICE");
            }}
            className="h-11 !rounded"
            options={Object.values(EDiscountType).map((value) => ({
              value,
              label: EDiscountTypeLabel[value],
            }))}
            value={getValues("target")}
          />
        </div>

        <div>
          <Label infoText="" label="Hình thức" />
          <CustomSelect
            onChange={(value) => {
              setValue("type", value, { shouldValidate: true });
              const newItems = [
                {
                  condition: {
                    order: {
                      from: 1,
                    },
                    product: {
                      type: value,
                    },
                  },
                  apply: {
                    discountValue: 0,
                    discountType: "AMOUNT",
                    pointType: "AMOUNT",
                    maxQuantity: 1,
                    isGift: false,
                    pointValue: 0,
                    type: value,
                  },

                  ...(value === EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER && {
                    childItems: [
                      {
                        condition: {
                          product: {
                            from: 1,
                          },
                          productUnitId: [],
                        },
                        apply: {
                          changeType: "TYPE_PRICE",
                          fixedPrice: 0,
                        },
                      },
                    ],
                  }),
                },
              ];
              setValue("items", newItems, { shouldValidate: true });
            }}
            options={
              getValues("target") === EDiscountType.ORDER
                ? Object.values(EDiscountBillMethod).map((value) => ({
                    value,
                    label: EDiscountBillMethodLabel[value],
                  }))
                : Object.values(EDiscountGoodsMethod111).map((value) => ({
                    value,
                    label: EDiscountGoodsMethodLabel[value],
                  }))
            }
            value={getValues("type")}
            className="h-11 !rounded"
          />
        </div>

        {getValues("target") === EDiscountType.PRODUCT && (
          <div className="flex items-end gap-2">
            <Checkbox
              checked={getValues("isMultiple")}
              onChange={(e) =>
                setValue("isMultiple", e.target.checked, {
                  shouldValidate: true,
                })
              }
            />
            <div>Nhân theo số lượng mua</div>
            <Image src={InfoIcon} alt="" />
          </div>
        )}
      </div>

      {/* Bill */}
      {getValues("target") === EDiscountType.ORDER && getValues("type") === EDiscountBillMethod.ORDER_PRICE && (
        <BillDiscount setValue={setValue} getValues={getValues} errors={errors} />
      )}

      {getValues("target") === EDiscountType.ORDER && getValues("type") === EDiscountBillMethod.PRODUCT_PRICE && (
        <BillDiscountProduct setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.ORDER && getValues("type") === EDiscountBillMethod.GIFT && (
        <BillGiftProduct setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.ORDER && getValues("type") === EDiscountBillMethod.LOYALTY && (
        <BillGiftPoint setValue={setValue} getValues={getValues} errors={errors} />
      )}

      {/* Product */}
      {getValues("target") === EDiscountType.PRODUCT && getValues("type") === EDiscountGoodsMethod.PRODUCT_PRICE && (
        <ProductDiscountProduct setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.PRODUCT && getValues("type") === EDiscountGoodsMethod.GIFT && (
        <ProductGiftProduct setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.PRODUCT && getValues("type") === EDiscountGoodsMethod.GIFT_AND_POINT && (
        <ProductGiftProductAndPoint setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.PRODUCT && getValues("type") === EDiscountGoodsMethod.LOYALTY && (
        <ProductGiftPoint setValue={setValue} getValues={getValues} errors={errors} />
      )}
      {getValues("target") === EDiscountType.PRODUCT &&
        getValues("type") === EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER && (
          <ProductQuantity setValue={setValue} getValues={getValues} errors={errors} />
        )}
    </div>
  );
};

export default Info;
