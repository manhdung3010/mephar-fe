import { useQuery } from '@tanstack/react-query';
import { DatePicker, Select, Tag, TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';

import { getEmployee } from '@/api/employee.service';
import ArrowDownGray from '@/assets/arrowDownGray.svg';
import DateIcon from '@/assets/dateIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { formatDate } from '@/helpers';

const { RangePicker } = DatePicker;

const Search = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void, formFilter: any }) => {
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

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

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );
  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-1/2">
          <CustomInput
            placeholder="Tìm kiếm theo mã phiếu"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={debounce((value) => {
              setFormFilter((preValue) => ({
                ...preValue,
                code: value,
              }));
            }, 300)}
          />
        </div>

        <div className="flex grow rounded-l-[3px] border border-[#D3D5D7]">
          <RangePicker
            bordered={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format={{ format: 'DD/MM/YYYY', type: 'mask' }}
            presets={rangePresets}
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  'paymentDate[start]': dayjs(value[0]).format('YYYY-MM-DD'),
                  'paymentDate[end]': dayjs(value[1]).format('YYYY-MM-DD'),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  'paymentDate[start]': undefined,
                  'paymentDate[end]': undefined,
                }));
              }
            }}
            value={[formFilter['paymentDate[start]'] ? dayjs(formFilter['paymentDate[start]']) : undefined, formFilter['paymentDate[end]'] ? dayjs(formFilter['paymentDate[end]']) : undefined]}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            className="w-[180px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Người tạo"
            optionFilterProp="children"
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  userId: value,
                }));
              }
              else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  userId: undefined,
                }));
              }
            }}
            onSearch={debounce((value) => {
              setSearchEmployeeText(value);
            }, 300)}
            showSearch={true}
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))}
            value={employees?.data?.items?.find((item) => item?.id === formFilter?.userId)?.fullName || undefined}
          />
          <Select
            className="w-[180px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Loại chứng từ"
            optionFilterProp="children"
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  ballotType: value,
                }));
              }
              else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  ballotType: undefined,
                }));
              }
            }}
            onSearch={debounce((value) => {
              setSearchEmployeeText(value);
            }, 300)}
            showSearch={true}
            options={[
              {
                value: 'income',
                label: 'Phiếu thu',
              },
              {
                value: 'expenses',
                label: 'Phiếu chi',
              }
            ]}
            value={formFilter?.ballotType}
          />
        </div>
      </div>
      <div className='flex items-center gap-4 p-4'>
        {
          Object.keys(formFilter).map((key, index) => {
            if (formFilter[key] && key !== "page" && key !== "limit" && key !== "keyword" && key !== "code" && key !== "branchId") {
              if ((key === "paymentDate[start]" || key === 'paymentDate[end]') && formFilter[key] !== null) {
                // render date range to Tag
                return
              }
              return (
                <Tag
                  key={index}
                  closable={true}
                  style={{ userSelect: 'none' }}
                  onClose={() => {
                    setFormFilter(prevState => {
                      const newState = { ...prevState };
                      newState[key] = null; // remove the key-value pair from the state
                      return newState;
                    });
                  }}
                  className='py-1 px-4'
                >
                  {
                    key === "userId" && (
                      <>
                        <span>
                          Người tạo:
                        </span>
                        <span className='ml-1 font-semibold'>{employees?.data?.items?.find((item) => item?.id === formFilter[key])?.fullName}</span>
                      </>
                    )
                  }
                  {
                    key === "ballotType" && (
                      <>
                        <span>
                          Loại phiếu:
                        </span>
                        <span className='ml-1 font-semibold'>{formFilter?.ballotType === 'income' ? 'Phiếu thu' : 'Phiếu chi'}</span>
                      </>
                    )
                  }

                </Tag>
              )
            }
            return null;
          })
        }
      </div>
    </div>
  );
};

export default Search;
