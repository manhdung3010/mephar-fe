import { DatePicker, Select } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import DateIcon from '@/assets/dateIcon.svg';
import FilterIcon from '@/assets/filterIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import ExportIcon from '@/assets/exportIcon.svg';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';
import { saleReportLabels } from '@/enums';
import { CustomSelect } from '@/components/CustomSelect';

const { RangePicker } = DatePicker;

const Search = () => {
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <div className="">
      <div className="flex items-center flex-col gap-5">
        <div className='bg-white p-5 w-full rounded-lg'>
          <CustomButton prefixIcon={<Image src={ExportIcon} />}>
            Xuất tất cả
          </CustomButton>
        </div>
        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Kiểu hiển thị' hasInfoIcon={false} />

          <CustomRadio
            options={[
              { value: 1, label: "Biểu đồ" },
              { value: 2, label: "Báo cáo" },
            ]}
            className='flex - flex-col'
            onChange={(value) =>
              // setValue("type", value, { shouldValidate: true })
              console.log("value", value)
            }
          // value={getValues("type")}
          />
        </div>
        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Mối quan tâm' hasInfoIcon={false} />

          <CustomRadio
            options={Object.keys(saleReportLabels).map((item) => ({
              value: item,
              label: saleReportLabels[item],
            }))}
            className='flex - flex-col'
            onChange={(value) =>
              // setValue("type", value, { shouldValidate: true })
              console.log("value", value)
            }
          // value={getValues("type")}
          />
        </div>

        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Chi nhánh' hasInfoIcon={false} />

          <CustomSelect
            // value={pageSize}
            className="border-underline w-full"
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]}
            onChange={(value) => {
              // setPerPage(value);
            }}
          />
        </div>

        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Bảng giá' hasInfoIcon={false} />

          <CustomSelect
            // value={pageSize}
            className="border-underline w-full"
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]}
            onChange={(value) => {
              // setPerPage(value);
            }}
          />
        </div>

        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Kiểu hiển thị' hasInfoIcon={false} />

          <CustomRadio
            options={[
              { value: 1, label: "Biểu đồ" },
              { value: 2, label: "Báo cáo" },
            ]}
            className='flex - flex-col'
            onChange={(value) =>
              // setValue("type", value, { shouldValidate: true })
              console.log("value", value)
            }
          // value={getValues("type")}
          />
        </div>

        {/* <div className="flex rounded-l-[3px] border border-[#D3D5D7]">
          <RangePicker
            bordered={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} />}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Nhóm khách hàng"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'tom',
                label: 'Tom',
              },
            ]}
          />
        </div> */}

        {/* <CustomButton
          type="original"
          outline={true}
          className="h-auto w-[130px] rounded-[3px]"
          suffixIcon={<Image src={FilterIcon} />}
        >
          Lưu bộ lọc
        </CustomButton> */}
      </div>
    </div>
  );
};

export default Search;
