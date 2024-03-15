import Image from 'next/image';

import DeleteRedIcon from '@/assets/deleteRed.svg';
import DocumentIcon from '@/assets/documentBlueIcon.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';

import type { EDiscountUnit } from './Info';

export const BillDiscountGiveGoods = ({
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
          <div className="flex-[2] p-4">Tên đơn vị</div>
          <div className="flex-[2] p-4">Giá trị quy đổi</div>
          <div className="flex-[2] p-4">Hàng/nhóm hàng tặng</div>
          <div className="flex-1 p-4"></div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-[2] items-center gap-2 px-4">
            Từ
            <CustomInput
              className="mt-0 h-11"
              wrapClassName="w-full"
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-[2] items-center gap-2 px-4">
            Giảm
            <CustomInput
              className="mt-0 h-11 w-full"
              wrapClassName="w-full"
              onChange={() => {}}
            />
          </div>
          <div className="flex-[2] p-4">
            <CustomInput
              className="mt-0 h-11 w-full"
              wrapClassName="w-full"
              prefixIcon={<Image src={SearchIcon} />}
              suffixIcon={<Image src={DocumentIcon} />}
              onChange={() => {}}
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
