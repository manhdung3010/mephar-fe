import { Input } from 'antd';
import Image from 'next/image';

import DeleteIcon from '@/assets/deleteRed.svg';
import { CustomButton } from '@/components/CustomButton';

const { TextArea } = Input;

export function Info({ record }: { record: any }) {
  return (
    <div className="gap-12 ">
      <div className="mb-4 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Mã chương trình:</div>
          <div className="text-black-main">DQG00006601</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Tên chương trình:</div>
          <div className="text-black-main">---</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Thời gian:</div>
          <div className="text-black-main">
            02/08/2023 11:19 - 25/08/2023 00:00
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Trạng thái:</div>
          <div className="text-[#00B63E]">Kích hoạt</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo tháng:</div>
          <div className="text-black-main">4</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Ghi chú:</div>
          <div className="text-black-main">Áp dụng sinh nhật chi nhánh</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo ngày:</div>
          <div className="text-black-main">2</div>
        </div>

        <div className="grid grid-cols-3 gap-5"></div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo thứ:</div>
          <div className="text-black-main">Chủ nhật, Thứ 4</div>
        </div>

        <div className="grid grid-cols-3 gap-5"></div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo giờ:</div>
          <div className="text-black-main">4</div>
        </div>
      </div>

      <div className="flex justify-end">
        <CustomButton
          type="danger"
          outline={true}
          prefixIcon={<Image src={DeleteIcon} alt="" />}
        >
          Xóa
        </CustomButton>
      </div>
    </div>
  );
}
