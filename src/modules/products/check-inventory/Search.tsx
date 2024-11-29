import { DatePicker, Select, Tag } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from '@/enums';
import { useEffect, useState } from 'react';
import DateIcon from '@/assets/dateIcon.svg';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { getEmployee } from '@/api/employee.service';
import { formatDate } from '@/helpers';
const { RangePicker } = DatePicker;

const Search = ({ onChange }: { onChange: (value) => void }) => {

  const [formFilter, setFormFilter] = useState({
    keyword: '',
    userCreateId: undefined,
    createdAt1: undefined,
    createdAt2: undefined,
  });
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

  useEffect(() => {
    onChange(formFilter);
  }, [formFilter])


  const handleChangeFormFilter = (key, value) => {
    setFormFilter({ ...formFilter, [key]: value });
    onChange({ ...formFilter, [key]: value });
  }

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-2/3">
          <CustomInput
            placeholder="Tìm kiếm theo mã kiểm kho"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            value={formFilter.keyword}
            onChange={(value) => handleChangeFormFilter('keyword', value)}
          />
        </div>
        <div className="flex grow rounded-l-[3px] border border-[#D3D5D7]">
          <RangePicker
            bordered={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format={{ format: 'DD/MM/YYYY', type: 'mask' }}
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue: any) => ({
                  ...preValue,
                  createdAt1: dayjs(value[0]).format('YYYY-MM-DD'),
                  createdAt2: dayjs(value[1]).format('YYYY-MM-DD'),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  createdAt1: undefined,
                  createdAt2: undefined,
                }));
              }
            }}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            className="w-[200px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Người tạo"
            optionFilterProp="children"
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  userCreateId: value,
                }));
              }
              else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  userCreateId: undefined,
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
            value={employees?.data?.items?.find((item) => item?.id === formFilter?.userCreateId)?.fullName || undefined}
          />
        </div>
      </div>
      {
        formFilter.userCreateId && (
          <div className='flex items-center gap-4 p-4'>
            <Tag
              closable={true}
              style={{ userSelect: 'none' }}
              onClose={() => {
                setFormFilter({ ...formFilter, userCreateId: undefined });
              }}
              className='py-1 px-4'
            >
              <span>
                Người tạo:
              </span>
              <span className='ml-1 font-semibold'>{employees?.data?.items?.find((item) => item?.id === formFilter.userCreateId)?.fullName}</span>

            </Tag>
          </div>
        )
      }

    </div>
  );
};

export default Search;
