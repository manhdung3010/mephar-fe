import { CustomInput } from '@/components/CustomInput';
import { debounce } from 'lodash';
import SearchIcon from '@/assets/searchIcon.svg';
import React from 'react'
import Image from 'next/image';
import TripCard from './TripCard';


function All() {
  return (
    <div>
      <CustomInput
        placeholder="Tìm kiếm theo mã phiếu"
        prefixIcon={<Image src={SearchIcon} alt="" />}
        className=""
        onChange={debounce((value) => {
          // setFormFilter((preValue) => ({
          //   ...preValue,
          //   code: value,
          // }));
        }, 300)}
      />

      <div className='grid grid-cols-2 gap-6 mt-6'>
        {
          Object.keys([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((item, index) => (
            <TripCard key={index} />
          ))
        }
      </div>

    </div>
  )
}

export default All