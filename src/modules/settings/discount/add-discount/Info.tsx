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

export enum EDiscountType {
  BILL = 'BILL',
  GOODS = 'GOODS',
}

export enum EDiscountTypeLabel {
  BILL = 'Hóa đơn',
  GOODS = 'Hàng hóa',
}

export enum EDiscountBillMethod {
  GIVE_GOODS = 'GIVE_GOODS',
  DISCOUNT_BILL = 'DISCOUNT_BILL',
}

export enum EDiscountBillMethodLabel {
  GIVE_GOODS = 'Tặng hàng',
  DISCOUNT_BILL = 'Giảm giá hóa đơn',
}

export enum EDiscountGoodsMethod {
  DISCOUNT_GOODS = 'DISCOUNT_GOODS',
  GIVE_GOODS = 'GIVE_GOODS',
}

export enum EDiscountGoodsMethodLabel {
  DISCOUNT_GOODS = 'Mua hàng giảm giá hàng',
  GIVE_GOODS = 'Mua hàng tặng hàng',
}

export enum EDiscountUnit {
  MONEY = 'MONEY',
  PERCENT = 'PERCENT',
}

const Info = () => {
  const [discountType, setDiscountType] = useState(EDiscountType.BILL);
  const [discountUnit, setDiscountUnit] = useState(EDiscountUnit.MONEY);

  const [discountMethod, setDiscountMethod] = useState<
    EDiscountBillMethod | EDiscountGoodsMethod
  >(EDiscountBillMethod.DISCOUNT_BILL);
  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl font-medium text-[#999]">THÔNG TIN</h2>

      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã chương trình" required />
          <CustomInput
            placeholder="Mã tự động"
            className="h-11"
            onChange={() => {}}
          />
        </div>

        <div>
          <Label infoText="" label="Trạng thái" />
          <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
            <CustomRadio
              options={[
                { value: 0, label: 'Kích hoạt' },
                { value: 1, label: 'Chưa áp dụng' },
              ]}
            />
          </div>
        </div>

        <div>
          <Label infoText="" label="Tên chương trình" required />
          <CustomInput
            placeholder="Tên chương trình khuyến mại"
            className="h-11"
            onChange={() => {}}
          />
        </div>

        <div>
          <Label infoText="" label="Ghi chú" />
          <CustomInput
            placeholder="Ghi chú"
            className="h-11"
            onChange={() => {}}
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
            discountType === EDiscountType.BILL
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(3, minmax(0, 1fr))',
        }}
      >
        <div>
          <Label infoText="" label="Khuyến mại theo" />
          <CustomSelect
            onChange={(value) => setDiscountType(value)}
            className="h-11 !rounded"
            options={Object.values(EDiscountType).map((value) => ({
              value,
              label: EDiscountTypeLabel[value],
            }))}
            value={discountType}
          />
        </div>

        <div>
          <Label infoText="" label="Hình thức" />
          <CustomSelect
            onChange={(value) => setDiscountMethod(value)}
            options={
              discountType === EDiscountType.BILL
                ? Object.values(EDiscountBillMethod).map((value) => ({
                    value,
                    label: EDiscountBillMethodLabel[value],
                  }))
                : Object.values(EDiscountGoodsMethod).map((value) => ({
                    value,
                    label: EDiscountGoodsMethodLabel[value],
                  }))
            }
            value={discountMethod}
            className="h-11 !rounded"
          />
        </div>

        {discountType === EDiscountType.GOODS && (
          <div className="flex items-end gap-2">
            <Checkbox />
            <div>Không nhân theo số lượng mua</div>
            <Image src={InfoIcon} alt="" />
          </div>
        )}
      </div>

      {discountType === EDiscountType.BILL &&
        discountMethod === EDiscountBillMethod.DISCOUNT_BILL && (
          <BillDiscount
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}

      {discountType === EDiscountType.BILL &&
        discountMethod === EDiscountBillMethod.GIVE_GOODS && (
          <BillDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}

      {discountType === EDiscountType.GOODS &&
        discountMethod === EDiscountGoodsMethod.DISCOUNT_GOODS && (
          <GoodsDiscount
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}

      {discountType === EDiscountType.GOODS &&
        discountMethod === EDiscountGoodsMethod.GIVE_GOODS && (
          <GoodsDiscountGiveGoods
            discountUnit={discountUnit}
            setDiscountUnit={setDiscountUnit}
          />
        )}
    </div>
  );
};

export default Info;
