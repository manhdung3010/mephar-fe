import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createGroupProduct } from '@/api/product.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';
import { createTypeTransaction } from '@/api/cashbook.service';

export function AddCollectType({
  isOpen,
  onCancel,
  setGroupProductKeyword,
  setProductValue,
  type
}: {
  isOpen: boolean;
  onCancel: () => void;
  setGroupProductKeyword: (value) => void;
  setProductValue: any;
  type: string
}) {
  const queryClient = useQueryClient();

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required('Đây là trường bắt buộc!'),
        description: yup.string(),
      })
    ),
    mode: 'onChange',
  });

  const {
    mutate: mutateCreateGroupProduct,
    isLoading: isLoadingCreateGroupProduct,
  } = useMutation(() => createTypeTransaction({ ...getValues(), ballotType: type }), {
    onSuccess: async (res) => {
      setProductValue('typeId', res.data.id);
      reset();
      await queryClient.invalidateQueries(['TYPE_TRANSACTION']);

      onCancel();
    },
    onError: (err: any) => {
      message.error(err?.message);
    },
  });

  const onSubmit = () => {
    mutateCreateGroupProduct();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm loại thu"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateGroupProduct}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Loại thu" required />
        <CustomInput
          placeholder="Nhập tên loại thu"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
      <div className="mb-5">
        <Label infoText="" label="Mô tả" />
        <CustomInput
          placeholder="Nhập mô tả"
          className="h-11"
          onChange={(e) => setValue('description', e, { shouldValidate: true })}
          value={getValues('description')}
        />
      </div>
    </CustomModal>
  );
}
