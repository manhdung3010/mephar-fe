import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createLevel } from '@/api/doctor.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddLevelModal({
  isOpen,
  onCancel,
  setLevelKeyword,
  setDoctorValue,
  onSave
}: {
  isOpen: boolean;
  onCancel: () => void;
  setLevelKeyword: (value) => void;
  setDoctorValue: any;
  onSave?: ({ levelId, levelName }) => void;
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

  const { mutate: mutateCreateLevel, isLoading: isLoadingCreateLevel } =
    useMutation(() => createLevel(getValues()), {
      onSuccess: async (res) => {
        setLevelKeyword(getValues('name'));
        setDoctorValue('levelId', res.data.id);
        await queryClient.invalidateQueries(['LEVEL']);
        if (onSave) {
          onSave({
            levelId: res.data.id,
            levelName: getValues('name'),
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
    mutateCreateLevel();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm trình độ"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateLevel}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên trình độ" required />
        <CustomInput
          placeholder="Nhập tên trình độ"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
