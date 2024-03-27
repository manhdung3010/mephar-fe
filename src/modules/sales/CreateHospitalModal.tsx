import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createHospital } from '@/api/doctor.service';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';

export function AddHospitalModal({
  isOpen,
  onCancel,
  onSave
}: {
  isOpen: boolean;
    onCancel: () => void;
  onSave: ({ healthFacilityId, healthFacilityName}) => void;
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

  const { mutate: mutateCreateHospital, isLoading: isLoadingCreateHospital } =
    useMutation(() => createHospital(getValues()), {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(['HOSPITAL']);
        if (onSave) {
          onSave({
            healthFacilityId: res.data.id,
            healthFacilityName: getValues('name'),
          })
        }
        reset();

        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreateHospital();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm cơ sở khám bệnh"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateHospital}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên cơ sở khám bệnh" required />
        <CustomInput
          placeholder="Nhập tên cơ sở khám bệnh"
          className="h-11"
          onChange={(e) => setValue('name', e, { shouldValidate: true })}
          value={getValues('name')}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
