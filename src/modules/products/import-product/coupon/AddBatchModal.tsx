import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import * as yup from 'yup';

import { createBatch } from '@/api/batch.service';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';
import { formatDate } from '@/helpers';
import { branchState } from '@/recoil/state';

export function AddBatchModal({
  isOpen,
  onCancel,
  productId,
  setListBatchSelected,
}: {
  isOpen: boolean;
  onCancel: () => void;
  productId?: number;
  setListBatchSelected: (value) => void;
}) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required('Đây là trường bắt buộc!'),
        expiryDate: yup.string().required('Đây là trường bắt buộc!'),
        quantity: yup.number().required('Đây là trường bắt buộc!'),
      })
    ),
    mode: 'onChange',
  });

  const { mutate: mutateCreateBatch, isLoading: isLoadingCreateBatch } =
    useMutation(
      () =>
        createBatch({
          ...getValues(),
          branchId,
          productId,
        }),
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(['LIST_BATCH']);
          setListBatchSelected((preValue) => [
            ...preValue,
            {
              ...getValues(),
              id: res?.data?.id,
              inventory: 0,
              originalInventory: 0,
            },
          ]);

          reset();
          onCancel();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateBatch();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm mới lô"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateBatch}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên lô" required />
        <CustomInput
          placeholder="Nhập tên lô"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>

      <div className="mb-5">
        <Label infoText="" label="Hạn sử dụng" required />
        <CustomDatePicker
          placeholder="Nhập hạn sử dụng"
          className="h-11 w-full rounded-r-none"
          onChange={(value) => {
            setValue('expiryDate', formatDate(value, 'YYYY-MM-DD'), {
              shouldValidate: true,
            });
          }}
          value={getValues('expiryDate')}
        />
        <InputError error={errors.name?.message} />
      </div>

      <div className="mb-5">
        <Label infoText="" label="Số lượng" required />
        <CustomInput
          placeholder="Nhập số lượng"
          className="h-11"
          onChange={(e) => setValue('quantity', e, { shouldValidate: true })}
          value={getValues('quantity')}
          type="number"
          // allowDecimal={true}
        />
        <InputError error={errors.quantity?.message} />
      </div>
    </CustomModal>
  );
}
