import { Checkbox } from 'antd';

import { CustomDatePicker } from '@/components/CustomDatePicker';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';

const TimeApplication = () => {
  return (
    <div className="mt-5">
      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Thời gian" />
          <div className="grid grid-cols-2 gap-2">
            <CustomDatePicker className="h-11" />
            <CustomDatePicker className="h-11" />
          </div>
        </div>

        <div>
          <Label infoText="" label="Theo thứ" />
          <CustomSelect
            onChange={() => {}}
            className="h-11 !rounded"
            placeholder="Chọn thứ"
          />
        </div>

        <div>
          <Label infoText="" label="Theo tháng" />
          <CustomSelect
            onChange={() => {}}
            className="h-11 !rounded"
            placeholder="Chọn tháng"
          />
        </div>

        <div>
          <Label infoText="" label="Theo ngày" />
          <CustomSelect
            onChange={() => {}}
            className="h-11 !rounded"
            placeholder="Chọn ngày"
          />
        </div>

        <div className="flex gap-2">
          <Checkbox />
          <div className="flex items-center gap-2">
            <div>Áp dụng vào</div>
            <CustomSelect
              onChange={() => {}}
              className="border-underline"
              wrapClassName="!w-[100px]"
              placeholder="Ngày"
            />
            <div>sinh nhật của khách hàng</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Checkbox />
          <div className="flex items-center gap-2">
            <CustomSelect
              onChange={() => {}}
              className="border-underline"
              wrapClassName="!w-[120px]"
              placeholder="Cảnh báo"
            />
            <div className="text-[#8F90A6]">
              (Nếu khách hàng đã được hưởng khuyến mại này)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeApplication;
