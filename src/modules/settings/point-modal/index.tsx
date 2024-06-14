import { getGroupCustomer } from '@/api/group-customer'
import { createPoint, getPointDetail } from '@/api/point.service'
import { CustomButton } from '@/components/CustomButton'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomInput } from '@/components/CustomInput'
import { CustomModal } from '@/components/CustomModal'
import { CustomRadio } from '@/components/CustomRadio'
import InputError from '@/components/InputError'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Select, Spin } from 'antd'
import { useEffect, useState } from 'react'

function PointModal({ isOpen, onCancel, getValues, setValue, handleSubmit, errors, reset }: any) {
  const [customerType, setCustomerType] = useState(1)
  const [pointType, setPointType] = useState('order')

  const { data: pointDetail, isLoading: isLoadingPointDetail } = useQuery(
    ['POINT_DETAIL', pointType],
    () => getPointDetail(pointType),
    {
      enabled: !!isOpen,
    }
  );

  useEffect(() => {
    if (pointDetail) {
      const pData = pointDetail.data
      setValue("type", pData.type)
      setValue("isConvertDefault", pData.isConvertDefault)
      setValue("convertMoneyBuy", pData.convertMoneyBuy)
      setValue("isPointPayment", pData.isPointPayment)
      setValue("convertMoneyPayment", pData.convertMoneyPayment)
      setValue("convertPoint", pData.convertPoint)
      setValue("afterByTime", pData.afterByTime)
      setValue("isDiscountProduct", pData.isDiscountProduct)
      setValue("isDiscountOrder", pData.isDiscountOrder)
      setValue("isPointBuy", pData.isPointBuy)
      setValue("isAllCustomer", pData.isAllCustomer)
      setValue("groupCustomers", pData.listGroupCustomer)
      setValue("status", pData.status)
      if (pData.listGroupCustomer.length > 0) {
        setCustomerType(2)
      }
    }
  }, [pointDetail])

  const { data: customers, isLoading } = useQuery(
    ['CUSTOMER_GROUP_DISCOUNT', 1, 999],
    () => getGroupCustomer({ page: 1, limit: 999 }),
    {
      enabled: !!isOpen,
    }
  );

  const { mutate: mutateCreatePoint, isLoading: isLoadingPoint } =
    useMutation(
      () => {
        return createPoint({ ...getValues(), status: 'active' });
      },
      {
        onSuccess: () => {
          setValue('status', 'active', { shouldValidate: true });
          reset();
          onCancel();
        },
      }
    );

  const onsubmit = () => {
    mutateCreatePoint();
  }
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thiết lập tích điểm"
      width={660}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div>
        <div>
          <CustomRadio
            options={[
              { value: "order", label: "Hóa đơn" },
              { value: "product", label: "Hàng hóa" },
            ]}
            onChange={(value) => {
              setPointType(value);
              setValue("type", value, { shouldValidate: true });
            }}
            value={pointType}
          />
        </div>
      </div>
      {
        isLoadingPointDetail ? <div className='grid place-items-center h-[300px]'>
          <Spin size='default' />
        </div> : (
          <div>
            <div className='grid grid-cols-1 gap-2 mt-4'>
              <div className='grid grid-cols-5'>
                {
                  pointType === 'order' ? (
                    <div className='col-span-2'>
                      Tỉ lệ quy đổi điểm thưởng
                    </div>
                  ) : (
                    <div className='col-span-2'>
                      <CustomCheckbox
                        className='mr-1'
                        value={getValues("isConvertDefault")}
                        onChange={(e) =>
                          setValue('isConvertDefault', e.target.checked, {
                            shouldValidate: true,
                          })
                        }
                      />
                      Tỉ lệ quy đổi mặc định
                    </div>
                  )
                }
                <div className='flex items-center gap-2 col-span-3 w-full justify-end'>
                  <div className='flex-1'>
                    <CustomInput
                      className="text-right"
                      type='number'
                      value={getValues("convertMoneyBuy")}
                      onChange={(value) => setValue("convertMoneyBuy", value, { shouldValidate: true })}
                    />
                    {
                      errors?.convertMoneyBuy && <InputError error={errors?.convertMoneyBuy?.message} />
                    }
                  </div>
                  <span className='bg-[#d64457] text-white px-2 py-[1px] rounded-sm whitespace-nowrap'>VNĐ</span>
                  <span className='whitespace-nowrap'>= 1 điểm thưởng</span>
                </div>
              </div>

              <div className='grid grid-cols-5 items-center'>
                <div className='col-span-2'>
                  <CustomCheckbox
                    className='mr-1'
                    value={getValues("isPointPayment")}
                    onChange={(e) =>
                      setValue('isPointPayment', e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                  /> Cho phép thanh toán bằng điểm
                </div>
                <div className='flex items-center gap-2 col-span-3'>
                  <div>
                    <CustomInput className="text-right" type='number' value={getValues("convertPoint")} onChange={(value) => setValue("convertPoint", value, { shouldValidate: true })} />
                    {
                      errors?.convertMoneyBuy && <InputError error={errors?.convertPoint?.message} />
                    }
                  </div>
                  <span className='flex-shrink-0 bg-[#ff8800] text-white px-2 py-[1px] rounded-sm'>điểm</span> =
                  <div>
                    <CustomInput type='number' className="text-right" value={getValues("convertMoneyPayment")} onChange={(value) => setValue("convertMoneyPayment", value, { shouldValidate: true })} />
                    {
                      errors?.convertMoneyBuy && <InputError error={errors?.convertMoneyPayment?.message} />
                    }
                  </div>
                  <span className='bg-[#d64457] text-white px-2 py-[1px] rounded-sm whitespace-nowrap'>VNĐ</span>
                </div>
              </div>
              <div className='grid grid-cols-5 items-center'>
                <div className='col-span-2'>
                  Cho phép thanh toán bằng điểm
                </div>
                <div className='flex items-center gap-2 col-span-3'>
                  <div className='flex-1'>
                    <CustomInput className="text-right" value={getValues("afterByTime")} type='number' onChange={(value) => setValue("afterByTime", value, { shouldValidate: true })} />
                  </div> lần mua
                </div>
              </div>
            </div>
            <div className='mt-5 flex gap-2 flex-col'>
              <div>
                <CustomCheckbox
                  className='mr-1'
                  onChange={(e) =>
                    setValue('isDiscountProduct', e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  checked={getValues('isDiscountProduct')}
                /> Không tích điểm cho sản phẩm giảm giá
              </div>
              <div>
                <CustomCheckbox
                  className='mr-1'
                  onChange={(e) =>
                    setValue('isDiscountOrder', e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  checked={getValues('isDiscountOrder')}
                /> Không tích điểm cho hóa đơn giảm giá
              </div>
              <div>
                <CustomCheckbox
                  className='mr-1'
                  onChange={(e) =>
                    setValue('isPointBuy', e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  checked={getValues('isPointBuy')}
                /> Không tích điểm cho hóa đơn thanh toán bằng điểm thưởng
              </div>
            </div>
            <div className='flex items-end gap-5 mt-5'>
              <CustomRadio
                className='flex flex-col w-52'
                onChange={(value) => {
                  if (value === 1) {
                    setValue('isAllCustomer', true, { shouldValidate: true })
                    setValue('groupCustomers', [], { shouldValidate: true })
                  }
                  else {
                    setValue('isAllCustomer', false, { shouldValidate: true })
                  }

                  setCustomerType(value)
                }}
                value={customerType}
                options={[{
                  value: 1,
                  label: 'Toàn bộ khách hàng',
                },
                {
                  value: 2,
                  label: "Nhóm khách hàng",
                }]}
              />
              <Select
                mode='multiple'
                disabled={customerType === 1}
                onChange={(value) => {
                  setValue('groupCustomers', value, { shouldValidate: true })
                }}
                value={getValues("groupCustomers") || []}
                className=" border-underline grow"
                placeholder="Chọn nhóm khách hàng áp dụng"
                options={customers?.data?.items.map((c) => ({
                  label: c.name,
                  value: c.id,
                })) || []
                }
                size='large'
              />
            </div>
          </div>
        )
      }
      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={onCancel}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            handleSubmit(onsubmit)();
          }}
          loading={isLoadingPoint}
          disabled={isLoadingPoint}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  )
}

export default PointModal