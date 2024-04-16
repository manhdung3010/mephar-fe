import { DatePicker, Select, TimeRangePickerProps } from 'antd';
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
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { useEffect, useState } from 'react';
import { set } from 'lodash';
import { getBranch } from '@/api/branch.service';
import { useQuery } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { branchState } from '@/recoil/state';

dayjs.extend(quarterOfYear);

const { RangePicker } = DatePicker;

const Search = ({ formFilter, setFormFilter, branches, branch }: any) => {
  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      setFormFilter({ ...formFilter, from: dates[0]?.format("YYYY-MM-DD"), to: dates[1]?.format("YYYY-MM-DD") });
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Hôm nay', value: [dayjs(), dayjs()] },
    { label: 'Hôm qua', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
    { label: 'Tuần này', value: [dayjs().startOf('week'), dayjs()] },
    { label: 'Tuần trước', value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')] },
    { label: '7 ngày qua', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs()] },
    { label: 'Tháng trước', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
    { label: '30 ngày qua', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Quý này', value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')] },
    { label: 'Quý trước', value: [dayjs().subtract(1, 'quarter').startOf('quarter'), dayjs().subtract(1, 'quarter').endOf('quarter')] },
  ];

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
              setFormFilter({ ...formFilter, type: value })
            }
            value={formFilter.type}
          />
        </div>
        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Mối quan tâm' hasInfoIcon={false} />

          <CustomRadio
            options={Object.keys(saleReportLabels).map((item) => ({
              value: +item,
              label: saleReportLabels[item],
            }))}
            className='flex - flex-col'
            onChange={(value) =>
              // setValue("type", value, { shouldValidate: true })
              setFormFilter({ ...formFilter, interest: value })
            }
            value={formFilter.interest}
          />
        </div>

        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Chi nhánh' hasInfoIcon={false} />

          <CustomSelect
            className="border-underline w-full"
            options={branches?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={(value) => {
              setFormFilter({ ...formFilter, branchId: value });
            }}
            value={formFilter.branchId}
          />
        </div>

        <div className='bg-white p-5 w-full rounded-lg'>
          <Label label='Thời gian' hasInfoIcon={false} />

          <RangePicker
            className='border-underline w-full'
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} alt='date-icon' />}
            presets={rangePresets} onChange={onRangeChange}
            value={[formFilter.from ? dayjs(formFilter.from) : null, formFilter.to ? dayjs(formFilter.to) : null]}
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
