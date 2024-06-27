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
import { createOtherUser, createTypeTransaction } from '@/api/cashbook.service';
import { CustomSelect } from '@/components/CustomSelect';
import { useAddress } from '@/hooks/useAddress';
import { regexPhoneNumber } from '@/constants';

export function AddOtherUserModal({
  isOpen,
  onCancel,
  setGroupProductKeyword,
  setProductValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setGroupProductKeyword: (value) => void;
  setProductValue: any;
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
        phone: yup
          .string()
          .required("Đây là trường bắt buộc!")
          .matches(regexPhoneNumber, "Vui lòng nhập đúng định dạng số điện thoại"),
        note: yup.string(),
        address: yup.string(),
        provinceId: yup.number(),
        districtId: yup.number(),
        wardId: yup.number(),
      })
    ),
    mode: 'onChange',
  });

  const {
    mutate: mutateCreateGroupProduct,
    isLoading: isLoadingCreateGroupProduct,
  } = useMutation(() => createOtherUser({ ...getValues() }), {
    onSuccess: async (res) => {
      setProductValue('targetId', res.data.id);
      reset();
      await queryClient.invalidateQueries(['OTHER_USER']);

      onCancel();
    },
    onError: (err: any) => {
      message.error(err?.message);
    },
  });

  const onSubmit = () => {
    mutateCreateGroupProduct();
  };

  const { provinces, districts, wards } = useAddress(
    getValues("provinceId"),
    getValues("districtId")
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm người nộp"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateGroupProduct}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className='flex flex-col gap-3'>
        <div>
          <Label infoText="" label="Người nộp" required />
          <CustomInput
            placeholder="Nhập tên người nộp"
            className="h-11"
            onChange={(e) => setValue('name', e, { shouldValidate: true })}
            value={getValues('name')}
          />
          <InputError error={errors.name?.message} />
        </div>
        <div>
          <Label infoText="" label="Điện thoại" required />
          <CustomInput
            placeholder="Nhập số điện thoại"
            className="h-11"
            onChange={(e) => setValue('phone', e, { shouldValidate: true })}
            value={getValues('phone')}
          />
          <InputError error={errors.phone?.message} />
        </div>
        <div>
          <Label infoText="" label="Địa chỉ" />
          <CustomInput
            placeholder="Nhập địa chỉ"
            className="h-11"
            onChange={(e) => setValue('address', e, { shouldValidate: true })}
            value={getValues('address')}
          />
        </div>
        <div>
          <Label infoText="" label="Tỉnh/Thành" />
          <CustomSelect
            onChange={(value) =>
              setValue("provinceId", value, { shouldValidate: true })
            }
            options={provinces?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("provinceId")}
            className=" h-11 !rounded"
            placeholder="Chọn tỉnh/thành"
            showSearch={true}
          />
          <InputError error={errors.provinceId?.message} />
        </div>

        <div>
          <Label infoText="" label="Quận/Huyện" />
          <CustomSelect
            onChange={(value) =>
              setValue("districtId", value, { shouldValidate: true })
            }
            options={districts?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("districtId")}
            className=" h-11 !rounded"
            placeholder="Chọn quận/huyện"
            showSearch={true}
          />
          <InputError error={errors.districtId?.message} />
        </div>
        <div>
          <Label infoText="" label="Phường/xã" />
          <CustomSelect
            onChange={(value) =>
              setValue("wardId", value, { shouldValidate: true })
            }
            options={wards?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("wardId")}
            className=" h-11 !rounded"
            placeholder="Chọn phường/xã"
            showSearch={true}
          />
          <InputError error={errors.wardId?.message} />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Ghi chú" />
          <CustomInput
            placeholder="Nhập ghi chú"
            className="h-11"
            onChange={(e) => setValue('note', e, { shouldValidate: true })}
            value={getValues('note')}
          />
        </div>
      </div>
    </CustomModal>
  );
}
