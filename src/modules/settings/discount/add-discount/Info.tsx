import { Checkbox } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

import InfoIcon from '@/assets/info-circle.svg';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';

import { BillDiscount } from './BillDiscount';
import { BillDiscountGiveGoods } from './BillDiscountGiveGoods';
import { GoodsDiscount } from './GoodsDiscount';
import { GoodsDiscountGiveGoods } from './GoodsDiscountGiveGoods';
import InputError from '@/components/InputError';

export enum EDiscountType {
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
}

export enum EDiscountTypeLabel {
  ORDER = 'Hóa đơn',
  PRODUCT = 'Hàng hóa',
}

export enum EDiscountBillMethod {
  ORDER_PRICE = 'ORDER_PRICE',
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  GIFT = 'GIFT',
  LOYALTY = 'LOYALTY',
}

export enum EDiscountBillMethodLabel {
  GIFT = 'Tặng hàng',
  ORDER_PRICE = 'Giảm giá hóa đơn',
  PRODUCT_PRICE = 'Giảm giá hàng',
  LOYALTY = 'Tặng điểm',
}

export enum EDiscountGoodsMethod {
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  GIFT = 'GIFT',
  LOYALTY = 'LOYALTY',
  PRICE_BY_BUY_NUMBER = 'PRICE_BY_BUY_NUMBER'
}

export enum EDiscountGoodsMethodLabel {
  PRODUCT_PRICE = 'Mua hàng giảm giá hàng',
  GIFT = 'Mua hàng tặng hàng',
  LOYALTY = 'Mua hàng tặng điểm',
  PRICE_BY_BUY_NUMBER = 'Giảm giá theo số lượng mua'
}

export enum EDiscountUnit {
  MONEY = 'MONEY',
  PERCENT = 'PERCENT',
}

const Info = ({ setValue, getValues, errors }: any) => {
  const [discountType, setDiscountType] = useState(EDiscountType.ORDER);
  const [discountUnit, setDiscountUnit] = useState(EDiscountUnit.MONEY);

  const [discountMethod, setDiscountMethod] = useState<
    EDiscountBillMethod | EDiscountGoodsMethod
  >(EDiscountBillMethod.ORDER_PRICE);
  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl font-medium text-[#999]">THÔNG TIN</h2>

      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã chương trình" />
          <CustomInput
            placeholder="Mã tự động"
            className="h-11"
            onChange={(value) =>
              setValue("code", value, { shouldValidate: true })
            }
            value={getValues("code")}
          />
          <InputError error={errors.code?.message} />
        </div>

        <div>
          <Label infoText="" label="Trạng thái" />
          <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
            <CustomRadio
              options={[
                { value: "active", label: 'Kích hoạt' },
                { value: "inactive", label: 'Chưa áp dụng' },
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
            onChange={(value) =>
              setValue("name", value, { shouldValidate: true })
            }
            value={getValues("name")}
          />
          <InputError error={errors.name?.message} />
        </div>

        <div>
          <Label infoText="" label="Ghi chú" />
          <CustomInput
            placeholder="Ghi chú"
            className="h-11"
            onChange={(value) =>
              setValue("note", value, { shouldValidate: true })
            }
            value={getValues("note")}
          />
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium uppercase text-[#999]">
        hình thức khuyến mại
      </h2>

      <div
        className="grid grid-cols-2 gap-x-[42px] gap-y-5"
        style={{
          gridTemplateColumns:
            discountType === EDiscountType.ORDER
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(3, minmax(0, 1fr))',
        }}
      >
        <div>
          <Label infoText="" label="Khuyến mại theo" />
          <CustomSelect
            onChange={(value) => {
              setValue("target", value, { shouldValidate: true })
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
              setValue("type", value, { shouldValidate: true })
            }}
            options={
              discountType === EDiscountType.ORDER
                ? Object.values(EDiscountBillMethod).map((value) => ({
                  value,
                  label: EDiscountBillMethodLabel[value],
                }))
                : Object.values(EDiscountGoodsMethod).map((value) => ({
                  value,
                  label: EDiscountGoodsMethodLabel[value],
                }))
            }
            value={getValues("type")}
            className="h-11 !rounded"
          />
        </div>

        {discountType === EDiscountType.PRODUCT && (
          <div className="flex items-end gap-2">
            <Checkbox />
            <div>Không nhân theo số lượng mua</div>
            <Image src={InfoIcon} alt="" />
          </div>
        )}
      </div>

      {/* Bill */}
      {discountType === EDiscountType.ORDER &&
        discountMethod === EDiscountBillMethod.ORDER_PRICE && (
          <BillDiscount
            setValue={setValue}
            getValues={getValues}
            errors={errors}
          />
        )}

      {discountType === EDiscountType.ORDER &&
        discountMethod === EDiscountBillMethod.PRODUCT_PRICE && (
          <BillDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
      {/* {discountType === EDiscountType.ORDER &&
        discountMethod === EDiscountBillMethod.GIFT && (
          <BillDiscount
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
      {discountType === EDiscountType.ORDER &&
        discountMethod === EDiscountBillMethod.LOYALTY && (
          <BillDiscount
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )} */}

      {/* Product */}
      {discountType === EDiscountType.PRODUCT &&
        discountMethod === EDiscountGoodsMethod.PRODUCT_PRICE && (
          <GoodsDiscount
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}

      {discountType === EDiscountType.PRODUCT &&
        discountMethod === EDiscountGoodsMethod.GIFT && (
          <GoodsDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
      {discountType === EDiscountType.PRODUCT &&
        discountMethod === EDiscountGoodsMethod.LOYALTY && (
          <GoodsDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
      {discountType === EDiscountType.PRODUCT &&
        discountMethod === EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER && (
          <GoodsDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
    </div>
  );
};

export default Info;
