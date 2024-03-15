import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createDosage } from '@/api/product.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddDosageModal({
  isOpen,
  onCancel,
  setDosageKeyword,
  setProductValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setDosageKeyword: (value) => void;
  setProductValue: any;
}) {
  const queryClient = useQueryClient();

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
      })
    ),
    mode: 'onChange',
  });

  const { mutate: mutateCreateDosage, isLoading: isLoadingCreateDOsage } =
    useMutation(() => createDosage(getValues()), {
      onSuccess: async (res) => {
        setDosageKeyword(getValues('name'));
        setProductValue('dosageId', res.data.id);
        await queryClient.invalidateQueries(['DOSAGE']);
        reset();

        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreateDosage();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm đường dùng"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateDOsage}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên đường dùng" required />
        <CustomInput
          placeholder="Nhập tên đường dùng"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
