import { getTripDetail } from '@/api/trip.service';
import { CustomButton } from '@/components/CustomButton';
import Label from '@/components/CustomLabel';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import LocationIcon from "@/assets/location.svg";
import LineIcon from "@/assets/LineDotLargeIcon.svg";
import DeleteIcon from "@/assets/deleteRed.svg";
import DateIcon from "@/assets/dateIcon.svg";
import MarkIcon from "@/assets/markIcon.svg";
import PhoneIcon from "@/assets/phoneIcon.svg";
import EditIcon from "@/assets/editWhite.svg";
import SuccessCircleIcon from "@/assets/successCircleIcon.svg";
import ArrowLeftIcon from "@/assets/arrowLeftIcon2.svg";
import CustomMap from '@/components/CustomMap'
import { formatDateTime } from '@/helpers';
import UpdateStatusModal from './UpdateTripStatusModal';
import { ECustomerStatus } from '../enum';

function TripDetail() {
  const router = useRouter();
  const { id } = router.query;
  const mapRef = useRef<any>(null);

  const [isMapFull, setIsMapFull] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [tripCustomerId, setTripCustomerId] = useState(null);

  const { data: tripDetail, isLoading } = useQuery(
    ["TRIP_DETAIL", id],
    () =>
      getTripDetail(id),
    {
      enabled: !!id,
    }
  );

  const handleAddMarker = (lng, lat, customerInfo?: any, customerIndex?: number) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.addMarker(coordinates, customerInfo ? customerInfo : null, customerIndex ? customerIndex : null);
    }
  };

  useEffect(() => {
    if (tripDetail?.data?.tripCustomer) {
      tripDetail?.data?.tripCustomer.map((item, index) => {
        handleAddMarker(+item?.lng, +item?.lat, item, index + 1);
      })
    }
    if (tripDetail?.data?.lng && tripDetail?.data?.lat) {
      handleAddMarker(+tripDetail?.data?.lng, +tripDetail?.data?.lat);
    }
  }, [tripDetail])
  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {"Chi tiết lịch trình"}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push("/customer-care/list-schedule")}
            prefixIcon={<Image src={DeleteIcon} alt="icon" />}
          >
            Xóa
          </CustomButton>
          <CustomButton
            // disabled={isLoadingCreateCustomer}
            // onClick={handleSubmit(onSubmit)}
            type="success"
            prefixIcon={<Image src={EditIcon} alt="icon" />}
          >
            Cập nhật
          </CustomButton>
        </div>
      </div>
      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className='grid grid-cols-12 gap-x-[42px]'>
            {
              isMapFull ? null : (
                <div className={`col-span-5 flex flex-col gap-y-5 }`}>
                  <div>
                    <h4 className='text-base font-medium text-[#182537] uppercase mb-2'>
                      {tripDetail?.data?.name}
                    </h4>
                    <div className='flex gap-6'>
                      <div className='flex items-center gap-1'>
                        <Image src={DateIcon} alt="icon" />
                        <span>
                          {formatDateTime(tripDetail?.data?.time)}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Image src={MarkIcon} alt="icon" />
                        <span>
                          {+tripDetail?.data?.total} điểm đến
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label infoText="" label="Các điểm tiếp thị" />
                    <div className='flex gap-y-3 flex-col'>
                      <div className='flex items-center'>
                        <div className='w-8 flex-shrink-0 flex items-center z-10'>
                          <Image src={LocationIcon} alt='icon' />
                        </div>
                        <div className='w-full border-[1px] border-[#D3D5D7] rounded py-3 px-4'>
                          Vị trí xuất phát
                          <div className="flex items-center space-x-1 mt-1">
                            <Image src={MarkIcon} alt="" />
                            <span>16 Hoàng Đạo Thúy</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-y-3 flex-col'>
                        {
                          tripDetail?.data?.tripCustomer?.map((item, index) => (
                            <div
                              className='flex gap-2 items-center'

                            >
                              {
                                item?.status === ECustomerStatus.VISITED ? (
                                  <div className='w-6 flex-shrink-0 flex items-center relative'>
                                    <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                                      <Image src={SuccessCircleIcon} alt='icon-success' />
                                    </div>
                                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-0'>
                                      <Image src={LineIcon} className='' alt='icon' />
                                    </div>
                                  </div>
                                ) : (
                                  <div className='w-6 flex-shrink-0 flex items-center relative cursor-pointer'>
                                    <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                                      {item?.stt}
                                    </div>
                                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-0'>
                                      <Image src={LineIcon} className='' alt='icon' />
                                    </div>
                                  </div>
                                )
                              }
                              <div
                                className={`w-full border-[1px] border-[#D3D5D7] rounded py-3 px-4 ${item?.status === ECustomerStatus.VISITED ? 'bg-[#f2fff9] border-[#11A75C]' : 'hover:bg-[#f2f7ff] hover:border-[#0177FB] transition-all cursor-pointer'} `}
                                onClick={() => {
                                  if (item?.status === ECustomerStatus.VISITED) return;
                                  setCustomerInfo(item?.customer)
                                  setTripCustomerId(item?.id)
                                  setIsShowModal(true)
                                }}
                              >
                                <div className='font-semibold'>
                                  <span className='text-red-main'>{item?.customer?.code}</span> - <span>{item?.customer?.fullName}</span>
                                  <span className={`ml-1 ${item?.customer?.status === 'active' ? 'bg-[#e5f8ec] text-[#00B63E] border-[1px] border-[#00B63E]' : item?.customer?.status === 'inactive' ? 'bg-[#feeaea] text-[#F32B2B] border-[1px] border-[#F32B2B]' : 'bg-[#f0e5fa] text-[#6600CC] border-[1px] border-[#6600CC]'}  rounded-full px-2 py-1 text-xs`}>{item?.customer?.status === 'active' ? "Hoạt động" : item?.customer?.status === 'inactive' ? "Ngưng hoạt động" : "Tiềm năng"}</span>
                                </div>
                                <div className="text-gray-600 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <Image src={PhoneIcon} alt="" />
                                    <span>{item?.customer?.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Image src={MarkIcon} alt="" />
                                    <span>{item?.address}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }

                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            <div className={`${isMapFull ? 'col-span-12' : 'col-span-7'} h-[700px] w-full relative`}>
              <CustomMap ref={mapRef} isMapFull={isMapFull} />
              <div className='absolute left-0 top-1/2 -translate-y-1/2 bg-white py-7 px-4 rounded-r-lg rounded-br-lg cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5] z-10'
                onClick={() => {
                  // change width full
                  setIsMapFull(!isMapFull)
                }
                }
              >
                <Image src={ArrowLeftIcon} className={`${isMapFull ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateStatusModal
        isOpen={isShowModal}
        onCancel={() => setIsShowModal(false)}
        onSuccess={() => setIsShowModal(false)}
        content={customerInfo}
        tripCustomerId={tripCustomerId}
      />
    </>
  )
}

export default TripDetail