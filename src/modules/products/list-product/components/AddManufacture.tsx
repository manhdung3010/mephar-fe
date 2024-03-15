import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createManufacture } from '@/api/product.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddManufactureModal({
  isOpen,
  onCancel,
  setManufactureKeyword,
  setProductValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setManufactureKeyword: (value) => void;
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

  const { mutate: mutateCreateManufacture, isLoading: isLoadingCreateDOsage } =
    useMutation(() => createManufacture(getValues()), {
      onSuccess: async (res) => {
        setManufactureKeyword(getValues('name'));
        setProductValue('manufactureId', res.data.id);
        await queryClient.invalidateQueries(['MANUFACTURE']);
        reset();

        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreateManufacture();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm nhà sản suất"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateDOsage}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên nhà sản suất" required />
        <CustomInput
          placeholder="Nhập tên nhà sản suất"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
