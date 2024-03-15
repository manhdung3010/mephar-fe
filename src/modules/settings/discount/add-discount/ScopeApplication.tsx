import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';

const ScopeApplication = () => {
  return (
    <div className="mt-5">
      <CustomRadio
        className="grid grid-cols-2 gap-x-[42px]"
        options={[
          {
            value: 1,
            label: 'Toàn hệ thống',
          },
          {
            value: 2,
            label: 'Toàn bộ khách hàng',
          },
          {
            value: 3,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-24">Chi nhánh</div>
                <CustomSelect
                  onChange={() => {}}
                  className=" border-underline grow"
                  placeholder="Chọn chi nhánh áp dụng"
                />
              </div>
            ),
          },
          {
            value: 4,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-36">Nhóm khách hàng</div>
                <CustomSelect
                  onChange={() => {}}
                  className=" border-underline grow"
                  placeholder="Chọn nhóm khách hàng áp dụng"
                />
              </div>
            ),
          },
          {
            value: 5,
            label: 'Toàn bộ người bán',
          },
          {
            value: 6,
            label: 'Toàn bộ các kênh bán hàng',
          },
          {
            value: 7,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-20">Người bán</div>
                <CustomSelect
                  onChange={() => {}}
                  className=" border-underline grow"
                  placeholder="Chọn người bán"
                />
              </div>
            ),
          },
          {
            value: 8,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-20">Kênh bán</div>
                <CustomSelect
                  onChange={() => {}}
                  className=" border-underline grow"
                  placeholder="Chợ"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ScopeApplication;
