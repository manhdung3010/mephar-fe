import { Input } from 'antd';
import Image from 'next/image';

import DeleteIcon from '@/assets/deleteRed.svg';
import { CustomButton } from '@/components/CustomButton';
import { formatDateTime } from '@/helpers';
import cx from 'classnames';
import { EDiscountStatus, EDiscountStatusLabel } from '@/enums';

const { TextArea } = Input;

export function Info({ record }: { record: any }) {
  console.log(record, 'record')
  return (
    <div className="gap-12 ">
      <div className="mb-4 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Mã chương trình:</div>
          <div className="text-black-main">{record?.id}</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Tên chương trình:</div>
          <div className="text-black-main">{record?.title}</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Thời gian:</div>
          <div className="text-black-main">
            {formatDateTime(record?.startTime) + " - " + formatDateTime(record?.endTime)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Trạng thái:</div>
          <div
            className={cx(
              record?.status === EDiscountStatus.active
                ? 'text-[#00B63E]'
                : 'text-[#6D6D6D]',
              'w-max'
            )}
          >
            {record?.status === EDiscountStatus.active ? EDiscountStatusLabel.active : EDiscountStatusLabel.inactive}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo tháng:</div>
          <div className="text-black-main">4</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Ghi chú:</div>
          <div className="text-black-main">{record?.description}</div>
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
