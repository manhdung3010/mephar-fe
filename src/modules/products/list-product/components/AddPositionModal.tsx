import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createPosition } from '@/api/product.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddPositionModal({
  isOpen,
  onCancel,
  setPositionKeyword,
  setProductValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setPositionKeyword: (value) => void;
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

  const { mutate: mutateCreatePosition, isLoading: isLoadingCreateDOsage } =
    useMutation(() => createPosition(getValues()), {
      onSuccess: async (res) => {
        setPositionKeyword(getValues('name'));
        setProductValue('positionId', res.data.id);
        await queryClient.invalidateQueries(['POSITION']);
        reset();

        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreatePosition();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm vị trí"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateDOsage}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên vị trí" required />
        <CustomInput
          placeholder="Nhập tên vị trí"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
