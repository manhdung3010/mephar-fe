import Image from 'next/image';

import DeleteRedIcon from '@/assets/deleteRed.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';

import type { EDiscountUnit } from '../Info';

export const GoodsDiscountGiveGoods = ({
  discountUnit,
  setDiscountUnit,
}: {
  discountUnit: EDiscountUnit;
  setDiscountUnit: (value: EDiscountUnit) => void;
}) => {
  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-[2] p-4">Hàng/nhóm hàng được giảm giá</div>
          <div className="flex-[2] p-4">Hàng/nhóm hàng mua</div>
          <div className="flex-1 p-4"></div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-[2] items-center gap-2 px-4">
            <CustomInput
              className="mt-0 h-11"
              wrapClassName="w-20"
              onChange={() => { }}
            />
            <CustomInput
              className="mt-0 h-11"
              wrapClassName="grow"
              placeholder="Tìm kiếm hàng hóa"
              prefixIcon={<Image src={SearchIcon} />}
              onChange={() => { }}
            />
          </div>

          <div className="flex flex-[2] gap-2 px-4">
            <CustomInput
              className="mt-0 h-11"
              wrapClassName="w-20"
              onChange={() => { }}
            />
            <CustomInput
              className="mt-0 h-11"
              wrapClassName="grow"
              placeholder="Tìm kiếm hàng hóa"
              prefixIcon={<Image src={SearchIcon} />}
              onChange={() => { }}
            />
          </div>

          <div className="flex flex-1 items-center justify-center px-4">
            <Image src={DeleteRedIcon} alt="" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-[16px] font-semibold text-[#D64457]">
        <Image src={PlusCircleIcon} alt="" />
        <div>Thêm điều kiện</div>
      </div>
    </>
  );
};
