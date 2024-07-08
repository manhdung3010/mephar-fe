import { CustomButton } from '@/components/CustomButton'
import { CustomDatePicker } from '@/components/CustomDatePicker'
import { CustomInput } from '@/components/CustomInput'
import Label from '@/components/CustomLabel'
import { useRouter } from 'next/router'
import LocationIcon from "@/assets/location.svg";
import LineIcon from "@/assets/lineDotIcon.svg";
import ArrowLeftIcon from "@/assets/arrowLeftIcon2.svg";
import React, { useState } from 'react'
import Image from 'next/image'
import { CustomSelect } from '@/components/CustomSelect'
import { debounce } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { getCustomer } from '@/api/customer.service'
import CustomMap from '@/components/CustomMap'

function CreateSchedule() {
  const router = useRouter();
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [isMapFull, setIsMapFull] = useState(true);

  const { data: customers } = useQuery(
    ["CUSTOMER", customerKeyword],
    () =>
      getCustomer({ page: 1, limit: 20, keyword: customerKeyword })
  );
  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {"Thêm mới lịch trình"}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push("/customer-care/list-schedule")}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            // disabled={isLoadingCreateCustomer}
            // onClick={handleSubmit(onSubmit)}
            type="danger"
          >
            Lưu
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
                    <Label infoText="" label="Tên lịch trình" required />
                    <CustomInput
                      placeholder="Nhập tên lịch trình"
                      className="h-11"
                      onChange={(e) => {
                        // setValue("code", e, { shouldValidate: true })
                      }}
                    // value={getValues("code")}
                    />
                  </div>
                  <div>
                    <Label infoText="" label="Thời gian bắt đầu" required />
                    <CustomDatePicker />
                  </div>
                  <div>
                    <Label infoText="" label="Chọn điểm tiếp thị" required />
                    <div className='flex gap-y-3 flex-col'>
                      <div className='flex items-center'>
                        <div className='w-8 flex-shrink-0 flex items-center z-10'>
                          <Image src={LocationIcon} alt='icon' />
                        </div>
                        <div className='w-full'>
                          <CustomInput
                            placeholder="Chọn vị trí xuất phát"
                            className="h-11"
                            onChange={(e) => {
                              // setValue("code", e, { shouldValidate: true })
                            }}
                          // value={getValues("code")}
                          />
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <div className='w-6 flex-shrink-0 flex items-center relative'>
                          <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                            1
                          </div>
                          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-0'>
                            <Image src={LineIcon} alt='icon' />
                          </div>
                        </div>
                        <div className='w-full'>
                          <CustomSelect
                            options={customers?.data?.items?.map((item) => ({
                              value: item.id,
                              label: item.fullName,
                            }))}
                            onChange={(value) => {
                              // setValue("groupCustomerId", value, { shouldValidate: true })
                            }}
                            // value={getValues("groupCustomerId")}
                            showSearch={true}
                            onSearch={debounce((value) => {
                              // setGroupCustomerKeyword(value);
                            }, 300)}
                            className=" h-11 !rounded"
                            placeholder="Chọn khách hàng"
                          />
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <div className='w-6 flex-shrink-0 flex items-center relative'>
                          <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                            1
                          </div>
                          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-0'>
                            <Image src={LineIcon} alt='icon' />
                          </div>
                        </div>
                        <div className='w-full'>
                          <CustomSelect
                            options={customers?.data?.items?.map((item) => ({
                              value: item.id,
                              label: item.fullName,
                            }))}
                            onChange={(value) => {
                              // setValue("groupCustomerId", value, { shouldValidate: true })
                            }}
                            // value={getValues("groupCustomerId")}
                            showSearch={true}
                            onSearch={debounce((value) => {
                              // setGroupCustomerKeyword(value);
                            }, 300)}
                            className=" h-11 !rounded"
                            placeholder="Chọn khách hàng"
                          />
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <div className='w-6 flex-shrink-0 flex items-center relative'>
                          <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                            1
                          </div>
                          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-0'>
                            <Image src={LineIcon} alt='icon' />
                          </div>
                        </div>
                        <div className='w-full'>
                          <CustomSelect
                            options={customers?.data?.items?.map((item) => ({
                              value: item.id,
                              label: item.fullName,
                            }))}
                            onChange={(value) => {
                              // setValue("groupCustomerId", value, { shouldValidate: true })
                            }}
                            // value={getValues("groupCustomerId")}
                            showSearch={true}
                            onSearch={debounce((value) => {
                              // setGroupCustomerKeyword(value);
                            }, 300)}
                            className=" h-11 !rounded"
                            placeholder="Chọn khách hàng"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            <div className={`${isMapFull ? 'col-span-12' : 'col-span-7'} h-[700px] w-full relative`}>
              <CustomMap />
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
    </>
  )
}

export default CreateSchedule