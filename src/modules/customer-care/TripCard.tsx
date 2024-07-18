import React from 'react'
import Image from 'next/image';
import DateIcon from '@/assets/dateIcon.svg';
import MarkIcon from '@/assets/markIcon.svg';
import PhoneIcon from '@/assets/phoneIcon.svg';
import MarkBgIcon from '@/assets/markBgIcon.svg';
import MarkSuccess from '@/assets/markSuccessIcon.svg';
import { formatDateTime, formatNumber } from '@/helpers';
import Link from 'next/link';

function TripCard({ data }: any) {
  const newData = data?.nextCustomer || data?.tripCustomer[0]
  return (
    <Link href={`/customer-care/list-schedule/${data?.id}`}>
      <div className="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden relative cursor-pointer">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold uppercase">{data?.name}</h2>
          <button className={`rounded-tr-xl rounded-bl-xl px-3 py-[6px] text-sm absolute right-0 top-0 ${data?.status === 'pending' ? 'bg-[#0177FB]' : 'bg-[#11A75C]'} text-white`}>{data?.status === 'pending' ? "Đang tiến hành" : "Đã hoàn thành"}</button>
        </div>
        <div className="p-4 pt-1 border-b border-[#E8F1FF]">
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center space-x-1">
              <Image src={DateIcon} alt="" />
              <span>{formatDateTime(data?.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Image src={MarkIcon} alt="" />
              <span>{formatNumber(data?.tripCustomer?.length)} điểm đến</span>
            </div>
          </div>
        </div>
        <div className='mt-4 mb-2 ml-4 font-medium text-sm'>
          Điểm đến tiếp theo
        </div>
        <div className="m-4 flex items-center space-x-4 border-[1px] border-[#D3D5D7] p-3 rounded">
          {
            data?.status === 'done'
              ? <div className="relative">
                <Image src={MarkSuccess} alt="" />
                {/* <span className='absolute top-2 left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white'>{newData?.stt}</span> */}
              </div>
              : <div className="relative">
                <Image src={MarkBgIcon} alt="" />
                <span className='absolute top-2 left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white'>{newData?.stt}</span>
              </div>
          }
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg "><span className='text-red-main'>{newData?.customer?.code}</span> - <span className='text-[#404040]'>{newData?.customer?.fullName}</span></div>
              <span className={`${newData?.customer?.status === 'active' ? 'bg-[#e5f8ec] text-[#00B63E] border-[1px] border-[#00B63E]' : newData?.customer?.status === 'inactive' ? 'bg-[#feeaea] text-[#F32B2B] border-[1px] border-[#F32B2B]' : 'bg-[#f0e5fa] text-[#6600CC] border-[1px] border-[#6600CC]'}  rounded-full px-2 py-1 text-xs`}>{newData?.customer?.status === 'active' ? "Hoạt động" : newData?.customer?.status === 'inactive' ? "Ngưng hoạt động" : "Tiềm năng"}</span>
            </div>
            <div className="text-gray-600 mt-2">
              <div className="flex items-center space-x-1">
                <Image src={PhoneIcon} alt="" />
                <span>{newData?.customer?.phone}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Image src={MarkIcon} alt="" />
                <span>{newData?.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Link>
  )
}

export default TripCard