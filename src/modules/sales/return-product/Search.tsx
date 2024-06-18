import { useQuery } from '@tanstack/react-query';
import { DatePicker, Select, Tag } from 'antd';
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
// import { billStatusData } from './interface';

const { RangePicker } = DatePicker;

const Search = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void, formFilter: any }) => {
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );


  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 py-4">
        <div className="w-2/3">
          <CustomInput
            placeholder="Tìm kiếm"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={debounce((value) => {
              setFormFilter((preValue) => ({
                ...preValue,
                keyword: value,
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
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: JSON.stringify({
                    startDate: dayjs(value[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(value[1]).format('YYYY-MM-DD'),
                  }),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: undefined,
                }));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
