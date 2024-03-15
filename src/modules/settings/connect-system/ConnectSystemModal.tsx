import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import * as yup from 'yup';

import { createConnectSystem } from '@/api/connect-system.service';
import HidePassword from '@/assets/images/hide-password.png';
import ViewPassword from '@/assets/images/view-password.png';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import InputError from '@/components/InputError';
import { branchState } from '@/recoil/state';

export function ConnectSystemModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);
  const [isHidePassword, setIsHidePassword] = useState(true);

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string().required('Đây là trường bắt buộc!'),
        password: yup.string().min(6).required('Đây là trường bắt buộc!'),
        code: yup.string().required('Đây là trường bắt buộc!'),
        branchId: yup.number(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      branchId,
    },
  });

  const { mutate: mutateConnect, isLoading: isLoadingConnect } = useMutation(
    () => createConnectSystem(getValues()),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['CONNECT_SYSTEM']);
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateConnect();
  };

  return (
    <CustomModal
      title="Kết nối cơ sở GPP với chi nhánh mặc định"
      isOpen={isOpen}
      onCancel={onCancel}
      width={680}
      textOk="Kết nối"
      textCancel="Thoát"
      isLoading={isLoadingConnect}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label label="Mã cơ sở" hasInfoIcon={false} required />
        <CustomInput
          className="h-11"
          placeholder="Nhập mã cơ sở GPP tương ứng chi nhánh"
          onChange={(value) =>
            setValue('code', value, { shouldValidate: true })
          }
        />
        <InputError error={errors.code?.message} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-x-[42px]">
        <div>
          <Label
            label="Tên đăng nhập vào hệ thống Dược Quốc gia"
            hasInfoIcon={false}
            required
          />
          <CustomInput
            className="h-11"
            placeholder="Nhập tên người dùng hoặc email"
            onChange={(value) =>
              setValue('username', value, { shouldValidate: true })
            }
          />
          <InputError error={errors.username?.message} />
        </div>

        <div>
          <Label label="Mật khẩu" hasInfoIcon={false} required />
          <CustomInput
            className="h-11"
            placeholder="Nhập mật khẩu"
            onChange={(value) =>
              setValue('password', value, { shouldValidate: true })
            }
            type={isHidePassword ? 'password' : 'text'}
            suffixIcon={
              <Image
                src={isHidePassword ? HidePassword : ViewPassword}
                alt=""
                onClick={() => setIsHidePassword((pre) => !pre)}
                width={16}
                height={16}
                className=" cursor-pointer"
              />
            }
          />
          <InputError error={errors.password?.message} />
        </div>
      </div>

      <div className="mb-10">
        <span className="text-red-main">Lưu ý: </span> Mephar sẽ lưu trữ các
        thông tin kết nối để đảm bảo trải nghiệm sử dụng sản phẩm của quý khách
        được liền mạch, không cần phải đăng nhập liên tục
      </div>
    </CustomModal>
  );
}
