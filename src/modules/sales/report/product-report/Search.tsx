import { DatePicker, TimeRangePickerProps } from 'antd';
import Image from 'next/image';

import DateIcon from '@/assets/dateIcon.svg';
import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';
import { productReportLabels, saleReportLabels } from '@/enums';
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

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
        {/* <div className='bg-white p-5 w-full rounded-lg'>
          <CustomButton prefixIcon={<Image src={ExportIcon} />}>
            Xuất tất cả
          </CustomButton>
        </div> */}
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
            options={Object.keys(productReportLabels).map((item) => ({
              value: item,
              label: productReportLabels[item],
            }))}
            className='flex - flex-col'
            onChange={(value) =>
              setFormFilter({ ...formFilter, concern: value })
            }
            value={formFilter.concern}
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
            format={{ format: 'DD/MM/YYYY', type: 'mask' }}
            suffixIcon={<Image src={DateIcon} alt='date-icon' />}
            presets={rangePresets} onChange={onRangeChange}
            value={[formFilter.from ? dayjs(formFilter.from) : null, formFilter.to ? dayjs(formFilter.to) : null]}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
