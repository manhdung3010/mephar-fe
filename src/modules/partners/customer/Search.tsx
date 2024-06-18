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
  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-full">
          <CustomInput
            placeholder="Tìm kiếm theo mã khách hàng"
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
