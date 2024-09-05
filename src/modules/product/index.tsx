import { checkProduct } from '@/api/market.service';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useRouter } from 'next/router';
import React from 'react'

function CheckSeri() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product, isLoading } = useQuery(
    ["CHECK_PRODUCT", id],
    () => checkProduct(id as string),
    {
      enabled: !!id,
    }
  );
  return (
    <div>
      <title>Check sản phẩm</title>
      {
        isLoading ? (
          <div className='text-center text-2xl text-gray-400 min-h-screen flex justify-center items-center'>
            <Spin />
          </div>
        ) : product?.data?.item?.data ? (
          <div>
            <h4 className='text-center text-lg font-semibold my-4 uppercase'>{product?.data?.item?.data?.name}</h4>
            <div>
              <div className='bg-[#fbecee] text-xl font-bold p-3'>Mã truy xuất: {id}</div>
              <div className=''>
                <div className='border-b border-gray-200 p-3'><span className='text-base font-medium'>Mã vạch:</span> <span className=''>{product?.data?.item?.data?.barCode}</span></div>
                <div className='border-b border-gray-200 p-3'><span className='text-base font-medium'>Quy cách đóng gói: </span> <span className=''></span></div>
                <div className='border-b border-gray-200 p-3'><span className='text-base font-medium'>Mã vạch:</span> <span className=''>{product?.data?.item?.data?.packingSpecification}</span></div>
                <div className='border-b border-gray-200 p-3'><span className='text-base font-medium'>Nguồn gốc/xuất xứ:</span> <span className=''>{product?.data?.item?.data?.productManufacture?.name}</span></div>
                <div className='border-b border-gray-200 p-3'>
                  {product?.data?.item?.data?.description}

                  <div className='text-center mt-5'>
                    <p className='text-gray-500'>Đơn vị sản xuất và cung cấp sản phẩm</p>
                    <h3 className='text-xl font-semibold mt-5'>{product?.data?.item?.data?.store?.name}</h3>
                  </div>
                </div>
                <div className='border-b border-gray-200 p-3'><span className='text-base font-medium'>Địa chỉ:</span> <span className=''>{product?.data?.item?.data?.store?.address}</span></div>
                <div className=' p-3 pb-10'><span className='text-base font-medium'>Số điện thoại:</span> <span className=''>{product?.data?.item?.data?.store?.phone}</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center text-2xl text-gray-400 min-h-screen flex justify-center items-center'>Không tìm thấy sản phẩm</div>
        )
      }
    </div>
  )
}

export default CheckSeri