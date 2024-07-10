import { CustomInput } from '@/components/CustomInput';
import { debounce } from 'lodash';
import SearchIcon from '@/assets/searchIcon.svg';
import React from 'react'
import Image from 'next/image';
import TripCard from './TripCard';
import { Spin } from 'antd';
import CustomPagination from '@/components/CustomPagination';


function All({ trips, formFilter, setFormFilter, isLoading }) {
  return (
    <div>
      <CustomInput
        placeholder="Tìm kiếm lịch trình"
        prefixIcon={<Image src={SearchIcon} alt="" />}
        className=""
        value={formFilter?.keyword}
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />

      {
        isLoading ? <div className='min-h-[400px] grid place-items-center'>
          <Spin size='default' />
        </div> : (
          <div className='grid grid-cols-2 gap-6 mt-6'>
            {
              trips?.data?.items?.map((item, index) => (
                <TripCard data={item} key={index} />
              ))
            }
          </div>
        )
      }

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={trips?.data?.totalItem}
      />
    </div>
  )
}

export default All