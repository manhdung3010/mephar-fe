import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal'
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import DateIcon from "@/assets/dateIcon.svg";
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { formatDate, formatMoney, formatNumber } from '@/helpers';
import { schema } from './schema';
import { format } from 'path';
import InputError from '@/components/InputError';
import { get } from 'lodash';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrderDebt } from '@/api/order.service';
import { message } from 'antd';
import { CustomSelect } from '@/components/CustomSelect';

function PaymentModal({ isOpen, onCancel, branches, branchId, isLoadingCreateCustomer, record }: { isOpen: boolean, onCancel: any, branches?: any, branchId?: any, isLoadingCreateCustomer?: any, record: any }) {
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const queryClient = useQueryClient();

  const { mutate: mutateCreateCustomer, isLoading } =
    useMutation(
      () => {
        return createOrderDebt(getValues(), record.orderId);
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['CUSTOMER_LIST']);
          await queryClient.invalidateQueries(["ORDER_LIST_DEBT"]);
          reset();
          onCancle();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  useEffect(() => {
    if (!!isOpen && record?.debtAmount) {
      setValue("totalAmount", Number(record?.debtAmount), { shouldValidate: true })
      setValue("paymentMethod", "CASH", { shouldValidate: true })
    }
  }, [isOpen, record?.debtAmount])

  const onSubmit = () => {
    mutateCreateCustomer();
  }

  const onCancle = () => {
    reset();
    onCancel();
  }

  return (
    <div>
      <CustomModal
        isOpen={isOpen}
        onCancel={onCancle}
        onSubmit={handleSubmit(onSubmit)}
        title={
          <div className="text-xl">
            Thanh toán
          </div>
        }
        width={950}
        isLoading={isLoadingCreateCustomer}
      >
        <div className=''>
          <div className='mb-5 grid grid-cols-4 gap-3'>
            <div>
              <Label infoText="" label="Nợ hiện tại" hasInfoIcon={false} />
              <CustomInput
                placeholder="Nợ hiện tại"
                className="h-11"
                onChange={(e) => setValue("totalAmount", e, { shouldValidate: true })}
                value={getValues("totalAmount") ? formatNumber(getValues("totalAmount")) : formatNumber(+record?.debtAmount)}
                disabled
              />
            </div>
            <div>
              <Label infoText="" label="Thu từ khách" hasInfoIcon={false} />
              <CustomInput
                placeholder="Thu từ khách"
                className="h-11"
                onChange={(e) => setValue("amount", e, { shouldValidate: true })}
                value={getValues("amount")}
                defaultValue={0}
                type='number'
              />
              <InputError error={errors.amount?.message} />
            </div>
            <div>
              <Label infoText="" label="Nợ sau" hasInfoIcon={false} />
              <CustomInput
                placeholder="Nợ sau"
                className="h-11"
                onChange={(e) => undefined}
                value={formatNumber(Number(getValues("totalAmount")) - Number(getValues("amount")))}
                disabled
              />
            </div>
            <div>
              <Label infoText="" label="Phương thức thanh toán" hasInfoIcon={false} />
              <CustomSelect
                value={getValues("paymentMethod")}
                className="h-11 !rounded"
                options={[
                  { value: "CASH", label: "Tiền mặt" },
                  { value: "BANK", label: "Chuyển khoản" },
                ]}
                onChange={(value) => {
                  setValue("paymentMethod", value, { shouldValidate: true })
                }}
              />
            </div>
          </div>
        </div>

      </CustomModal>
    </div>
  )
}

export default PaymentModal