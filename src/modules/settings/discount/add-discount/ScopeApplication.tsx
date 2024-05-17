import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';

const ScopeApplication = ({ setValue, getValues }: any) => {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
      <CustomRadio
        className='flex flex-col'
        onChange={(value) => setValue("branch", value)}
        value={getValues("branch")}
        options={[{
          value: 1,
          label: 'Toàn hệ thống',
        },
        {
          value: 2,
          label: (
            <div className="flex items-center gap-2">
              <div className="w-24">Chi nhánh</div>
              <CustomSelect
                onChange={() => { }}
                className=" border-underline grow"
                placeholder="Chọn chi nhánh áp dụng"
              />
            </div>
          ),
        },]}
      />
      <CustomRadio
        className='flex flex-col'
        onChange={(value) => setValue("branch", value)}
        value={getValues("branch")}
        options={[{
          value: 1,
          label: 'Toàn bộ khách hàng',
        },
        {
          value: 2,
          label: (
            <div className="flex items-center gap-2">
              <div className="w-36">Nhóm khách hàng</div>
              <CustomSelect
                onChange={() => { }}
                className=" border-underline grow"
                placeholder="Chọn nhóm khách hàng áp dụng"
              />
            </div>
          ),
        }]}
      />
      <CustomRadio
        className='flex flex-col'
        onChange={(value) => setValue("branch", value)}
        value={getValues("branch")}
        options={[{
          value: 1,
          label: 'Toàn bộ người bán',
        },
        {
          value: 2,
          label: (
            <div className="flex items-center gap-2">
              <div className="w-24">Người bán</div>
              <CustomSelect
                onChange={() => { }}
                className=" border-underline grow"
                placeholder="Chọn người bán áp dụng"
              />
            </div>
          ),
        },]}
      />

    </div>
  );
};

export default ScopeApplication;
