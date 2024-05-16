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
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { getGroupCustomer } from '@/api/group-customer';
import { getBranch } from '@/api/branch.service';

const { RangePicker } = DatePicker;

const Search = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void, formFilter: any }) => {
  const [searchEmployeeText, setSearchEmployeeText] = useState('');
  const [searchGroupCustomer, setSearchGroupCustomer] = useState('');

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  const { data: groupCustomer, isLoading } = useQuery(
    ['GROUP_CUSTOMER', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getGroupCustomer({ page: 1, limit: 20, keyword: searchGroupCustomer })
  );

  const { data: branches } = useQuery(['SETTING_BRANCH'], () => getBranch());


  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-full">
          <CustomInput
            placeholder="Tìm kiếm theo mã nhập hàng"
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
      </div>
    </div>
  );
};

export default Search;
