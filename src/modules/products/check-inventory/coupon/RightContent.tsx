import Image from 'next/image';
import { useState } from 'react';

import CopyIcon from '@/assets/copyIcon.svg';
import EditIcon from '@/assets/editIcon.svg';
import PlusIcon from '@/assets/plusIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';

export function RightContent() {
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);

  const options = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
    { value: 'disabled', label: 'Disabled', disabled: true },
  ];

  return (
    <div className="flex h-[calc(100vh-52px)] w-[360px] min-w-[360px] flex-col border-l border-[#E4E4E4] bg-white">
      <div className="px-6 pt-5 ">
        <CustomSelect
          options={options}
          onChange={(value) => {}}
          wrapClassName="mb-3"
          className="h-[44px]"
          placeholder="Chọn nhân viên bán hàng"
        />
        <CustomSelect
          options={options}
          onChange={(value) => {}}
          wrapClassName="mb-3"
          className="h-[44px]"
          placeholder="Tìm nhà cung cấp"
          suffixIcon={
            <Image
              src={PlusIcon}
              onClick={(e) => {
                setIsOpenAddCustomerModal(true);
                e.stopPropagation();
              }}
            />
          }
        />
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 grid grid-cols-2">
              <div className=" leading-normal text-[#828487]">
                Mã đặt hàng nhập
              </div>
              <CustomInput
                bordered={false}
                placeholder="Mã phiếu tự động"
                className="h-6 pr-0 text-end"
                onChange={() => {}}
              />
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Trạng thái</div>
              <div className=" leading-normal text-[#19191C]">Phiếu tạm</div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng SL thực tế
              </div>
              <div className=" leading-normal text-[#19191C]">10</div>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-5 font-medium">KIẾM GẦN ĐÂY</div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487] ">
                Bạch đái hoàn Xuân quang
              </div>
              <Image src={CopyIcon} />
            </div>
          </div>
        </div>

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="grid grid-cols-2 gap-3 px-6 pb-4">
        <CustomButton className="!h-12 text-lg font-semibold">
          Lưu tạm
        </CustomButton>
        <CustomButton className="!h-12 text-lg font-semibold" type="success">
          Hoàn thành
        </CustomButton>
      </div>
    </div>
  );
}
