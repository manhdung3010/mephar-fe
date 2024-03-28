import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createMajor } from '@/api/doctor.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddMajorModal({
  isOpen,
  onCancel,
  setMajorKeyword,
  setDoctorValue,
  onSave
}: {
  isOpen: boolean;
  onCancel: () => void;
  setMajorKeyword: (value) => void;
  setDoctorValue: any;
  onSave?: ({ specialistId, specialistName }) => void;
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

  const { mutate: mutateCreateMajor, isLoading: isLoadingCreateMajor } =
    useMutation(() => createMajor(getValues()), {
      onSuccess: async (res) => {
        setMajorKeyword(getValues('name'));
        setDoctorValue('specialistId', res.data.id);
        await queryClient.invalidateQueries(['MAJOR']);
        if (onSave) {
          onSave({
            specialistId: res.data.id,
            specialistName: getValues('name'),
          });
        }
        reset();

        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreateMajor();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm chuyên khoa"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateMajor}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên chuyên khoa" required />
        <CustomInput
          placeholder="Nhập tên chuyên khoa"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
