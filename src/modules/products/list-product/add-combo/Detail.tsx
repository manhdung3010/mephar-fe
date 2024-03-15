import { CustomInput, CustomTextarea } from '@/components/CustomInput';

import Label from '../../../../components/CustomLabel';

const Detail = () => {
  return (
    <div className="mt-5 flex flex-col gap-5 text-[#15171A]">
      <div className="flex w-full flex-col gap-5 px-4 py-3">
        <div className="font-medium">Định mức tồn</div>
        <div className="mt-4 grid grid-cols-2 gap-[42px] rounded border border-[#D3D5D7] px-4 py-3">
          <div>
            <Label label="Ít nhất" required={false} />
            <CustomInput
              className="h-11"
              bordered={false}
              onChange={() => {}}
            />
          </div>
          <div>
            <Label label="Nhiều nhất" required={false} />
            <CustomInput
              className="h-11"
              bordered={false}
              placeholder="Nhập số liệu"
              onChange={() => {}}
            />
          </div>
        </div>
        <div>
          <Label label="Mô tả" required={false} />
          <CustomTextarea placeholder="Nhập mô tả" autoSize={{ minRows: 10 }} />
        </div>
        <div>
          <Label label="Mẫu ghi chú (hóa đơn, đặt hàng)" required={false} />
          <CustomTextarea
            placeholder="Nhập ghi chú"
            autoSize={{ minRows: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
