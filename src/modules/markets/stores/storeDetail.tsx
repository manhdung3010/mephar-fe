import React, { useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getConfigProduct } from '@/api/market.service';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

function StoreDetail() {

  const router = useRouter()
  const { id } = router.query
  const branchId = useRecoilValue(branchState);
  const [select, setSelect] = useState(0);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    type: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    isConfig: true,
    branchId
  });

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter)],
    () => getConfigProduct(formFilter),
  );

  const menu = ['Sản phẩm mới', 'Bán chạy', 'Thuốc', 'Thực phẩm'];
  return (
    <div className='bg-[#fafafc]'>
      <div className='bg-white'>
        <div className='fluid-container'>
          <nav className="breadcrumb pt-3">
            <ul className="flex">
              <li className='!text-red-main'>
                <span className="">Trang chủ</span>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">Chi tiết đại lý</a>
              </li>
            </ul>
          </nav>

          <div className='grid grid-cols-12 gap-8 mt-3'>
            <div className='col-span-5'>
              <div className={` h-[220px] rounded-2xl overflow-hidden relative bg-bottom bg-cover`} style={{ backgroundImage: 'url("https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75")' }}>
                <div className='flex gap-3 items-center absolute top-1/2 -translate-y-1/2 px-9 z-50'>
                  <div className='w-[100px] h-[100px] flex-shrink-0 rounded-full overflow-hidden'>
                    <img className='w-full h-full object-cover' src="https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75" alt="" />
                  </div>
                  <div className='text-white flex flex-col gap-2'>
                    <h4 className='text-xl font-semibold line-clamp-1'>TIM Care Diamond TIM Care Diamond TIM Care Diamond</h4>
                    <p className='text-[#FAFAFC]'>Chi nhánh Hà Nội</p>
                  </div>
                </div>
                <div className='absolute w-full h-full top-0 bottom-0 left-0 right-0 z-10' style={{ backgroundColor: 'rgba(0, 0, 0, .5)' }}>
                </div>
              </div>
            </div>
            <div className='col-span-7 grid grid-cols-2'>
              <div className='flex items-center'>
                <span className='w-40'>Tổng sản phẩm: </span>
                <span className='text-red-main'>100</span>
              </div>
              <div className='flex items-center'>
                <span className='w-40'>Đã bán: </span>
                <span className='text-red-main'>100</span>
              </div>
              <div className='flex items-center'>
                <span className='w-40'>Giờ mở cửa: </span>
                <span className='text-red-main'>100</span>
              </div>
              <div className='flex items-center'>
                <span className='w-40'>Địa chỉ: </span>
                <span className='text-red-main'>100</span>
              </div>
            </div>
          </div>
          <div className='mt-4 pb-3'>
            <div className="flex flex-col">
              <div className="flex gap-3">
                {menu.map((item, index) => (
                  <div
                    key={index}
                    className={classNames(
                      'cursor-pointer px-5 py-[6px] rounded-t-lg relative text-2xl font-medium text-[#28293D]',
                      index === select
                        ? 'text-red-main'
                        : 'text-black-main'
                    )}
                    onClick={() => setSelect(index)}
                  >
                    {item}
                    {
                      index === select && <div className='w-[57px] h-[6px] bg-red-main absolute -bottom-2 left-1/2 -translate-x-1/2 rounded' />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' h-36'>

      </div>
    </div>
  )
}

export default StoreDetail