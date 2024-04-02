import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal'
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import DateIcon from "@/assets/dateIcon.svg";
import React from 'react'
import { useForm } from 'react-hook-form';
import { formatDate } from '@/helpers';

function PaymentModal({ isOpen, onCancel, onSubmit, branches, branchId, isLoadingCreateCustomer }: { isOpen: boolean, onCancel: any, onSubmit: any, branches?: any, branchId?: any, isLoadingCreateCustomer?: any }) {
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      code: "",
      time: "",
      debt: 0
    },
  });
  return (
    <div>
      <CustomModal
        isOpen={isOpen}
        onCancel={onCancel}
        onSubmit={handleSubmit(onSubmit)}
        title={
          <div className="text-xl">
            Thanh toán
          </div>
        }
        width={950}
        isLoading={isLoadingCreateCustomer}
      >
        <div className='grid grid-cols-[8fr,4fr] gap-5'>
          <div className='mb-5 grid grid-cols-2 gap-3'>
            <div>
              <Label infoText="" label="Nợ hiện tại" />
              <CustomInput
                placeholder="Nợ hiện tại"
                className="h-11"
                onChange={(e) => setValue("code", e, { shouldValidate: true })}
                value={getValues("code")}
                disabled
              />
            </div>
            <div>
              <Label infoText="" label="Thời gian" />
              <CustomDatePicker
                placeholder="Thời gian"
                suffixIcon={<Image src={DateIcon} alt="" />}
                className="h-11 w-full"
                onChange={(value) => {
                  setValue("time", formatDate(value, "YYYY-MM-DD"), {
                    shouldValidate: true,
                  });
                }}
                value={getValues("time")}
              />
            </div>
            <div>
              <Label infoText="" label="Thu từ khách" />
              <CustomInput
                placeholder="Mã mặc định"
                className="h-11"
                onChange={(e) => setValue("code", e, { shouldValidate: true })}
                value={getValues("code")}
              />
            </div>
            <div>
              <Label infoText="" label="Phương thức" />
              <CustomInput
                placeholder="Mã mặc định"
                className="h-11"
                onChange={(e) => setValue("code", e, { shouldValidate: true })}
                value={getValues("code")}
              />
            </div>
            <div>
              <Label infoText="" label="Nợ sau" />
              <CustomInput
                placeholder="Mã mặc định"
                className="h-11"
                onChange={(e) => setValue("debt", e, { shouldValidate: true })}
                value={getValues("debt")}
              />
            </div>
          </div>
          <div>
            <Label infoText="" label="Ghi chú" />
            <CustomTextarea rows={8} placeholder="Ghi chú:" onChange={(e: any) => setValue("code", e, { shouldValidate: true })}
              value={getValues("code")} />
          </div>
        </div>

      </CustomModal>
    </div>
  )
}

export default PaymentModal