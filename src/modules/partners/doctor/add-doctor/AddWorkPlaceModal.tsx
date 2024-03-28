import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createWorkPlace } from '@/api/doctor.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddWorkPlaceModal({
  isOpen,
  onCancel,
  setWordPlaceKeyword,
  setDoctorValue,
  onSave
}: {
  isOpen: boolean;
  onCancel: () => void;
  setWordPlaceKeyword: (value) => void;
  setDoctorValue: any;
  onSave?: ({ workPlaceId, workPlaceName }) => void;
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

  const { mutate: mutateCreateWorkPlace, isLoading: isLoadingCreateWorkPlace } =
    useMutation(() => createWorkPlace(getValues()), {
      onSuccess: async (res) => {
        setWordPlaceKeyword(getValues('name'));
        setDoctorValue('workPlaceId', res.data.id);
        await queryClient.invalidateQueries(['WORK_PLACE']);
        if (onSave) {
          onSave({
            workPlaceId: res.data.id,
            workPlaceName: getValues('name'),
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
    mutateCreateWorkPlace();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm nơi công tác"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateWorkPlace}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Nơi công tác" required />
        <CustomInput
          placeholder="Nhập nơi công tác"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
