import { Input } from 'antd';
import Image from 'next/image';

import BillIcon from '@/assets/billIcon.svg';
import PrintIcon from '@/assets/printOrder.svg';
import { CustomButton } from '@/components/CustomButton';

const { TextArea } = Input;

export function Info({ record }: { record: any }) {
  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Mã phiếu:</div>
            <div className="text-black-main">DQG00006601</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Chi nhánh:</div>
            <div className="text-black-main">Chi nhánh mặc định</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Thời gian:</div>
            <div className="text-black-main">30-10-2023 15:49</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Loại thu chi:</div>
            <div className="text-black-main">Thu tiền từ khách hàng</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Giá trị:</div>
            <div className="text-black-main">108,000</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Trạng thái:</div>
            <div className="text-[#00B63E]">Đã hoàn thành</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Người nộp:</div>
            <div className="text-black-main">---</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Người nộp:</div>
            <div className="text-black-main">dungtest</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Số điện thoại:</div>
            <div className="text-black-main">---</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Đối tượng nộp:</div>
            <div className="text-black-main">Khách hàng</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Địa chỉ:</div>
            <div className="text-black-main">---</div>
          </div>
        </div>

        <div className="grow">
          <TextArea rows={8} placeholder="Ghi chú:" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={BillIcon} alt="" />}
        >
          Mở phiếu
        </CustomButton>

        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={PrintIcon} alt="" />}
        >
          In sổ
        </CustomButton>
      </div>
    </div>
  );
}
