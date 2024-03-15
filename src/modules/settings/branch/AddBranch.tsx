import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  createBranch,
  getBranchDetail,
  updateBranch,
} from '@/api/branch.service';
import { CustomButton } from '@/components/CustomButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import { ECommonStatus } from '@/enums';
import { useAddress } from '@/hooks/useAddress';

import { schema } from './schema';

export function AddBranch({ branchId }: { branchId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isDefaultBranch: false,
      status: ECommonStatus.active,
    },
  });

  const { data: branchDetail } = useQuery(
    ['BRANCH_DETAIL', branchId],
    () => getBranchDetail(Number(branchId)),
    { enabled: !!branchId }
  );

  const { provinces, districts, wards } = useAddress(
    getValues('provinceId'),
    getValues('districtId')
  );

  const { mutate: mutateCreateBranch, isLoading: isLoadingCreateBranch } =
    useMutation(
      () =>
        branchDetail
          ? updateBranch(branchDetail?.data?.id, getValues())
          : createBranch(getValues()),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['SETTING_BRANCH']);
          reset();

          router.push('/settings/branch');
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateBranch();
  };

  useEffect(() => {
    if (branchDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(branchDetail.data[key])) {
          setValue(key, branchDetail.data[key], { shouldValidate: true });
        }
      });
    }
  }, [branchDetail]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {branchDetail ? 'Cập nhật chi nhánh' : 'Thêm mới chi nhánh'}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push('/settings/branch')}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            disabled={isLoadingCreateBranch}
            onClick={handleSubmit(onSubmit)}
            type="danger"
          >
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="grow  bg-white p-5">
        <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
          <div>
            <Label infoText="" label="Tên chi nhánh" required />
            <CustomInput
              placeholder="Nhập tên chi nhánh"
              className="h-11"
              onChange={(e) => setValue('name', e, { shouldValidate: true })}
              value={getValues('name')}
            />
            <InputError error={errors.name?.message} />
          </div>

          <div>
            <Label infoText="" label="Địa chỉ 1" required />
            <CustomInput
              placeholder="Nhập địa chỉ"
              className="h-11"
              onChange={(e) =>
                setValue('address1', e, { shouldValidate: true })
              }
              value={getValues('address1')}
            />
            <InputError error={errors.address1?.message} />
          </div>

          <div>
            <Label infoText="" label="Số điện thoại" required />
            <CustomInput
              placeholder="Nhập sđt"
              className="h-11"
              onChange={(e) => setValue('phone', e, { shouldValidate: true })}
              value={getValues('phone')}
            />
            <InputError error={errors.phone?.message} />
          </div>

          <div>
            <Label infoText="" label="Tỉnh/Thành phố" />
            <CustomSelect
              className=" h-11 !rounded"
              placeholder="Chọn tỉnh/thành"
              onChange={(value) => {
                setValue('provinceId', value, { shouldValidate: true });
                setValue('districtId', undefined as any, {
                  shouldValidate: true,
                });
                setValue('wardId', undefined as any, { shouldValidate: true });
              }}
              options={provinces?.data?.items?.map((province) => ({
                value: province.id,
                label: province.name,
              }))}
              showSearch={true}
              value={getValues('provinceId')}
            />
            <InputError error={errors.provinceId?.message} />
          </div>

          <div>
            <Label infoText="" label="Mã chi nhánh" />
            <CustomInput
              placeholder="Mã chi nhánh"
              className="h-11"
              onChange={(e) => setValue('code', e, { shouldValidate: true })}
              value={getValues('code')}
            />
            <InputError error={errors.code?.message} />
          </div>

          <div>
            <Label infoText="" label="Quận/Huyện" />
            <CustomSelect
              className=" h-11 !rounded"
              onChange={(value) => {
                setValue('districtId', value, { shouldValidate: true });
                setValue('wardId', undefined as any, { shouldValidate: true });
              }}
              placeholder="Chọn quận/huyện"
              options={districts?.data?.items?.map((district) => ({
                value: district.id,
                label: district.name,
              }))}
              showSearch={true}
              value={getValues('districtId')}
            />
            <InputError error={errors.districtId?.message} />
          </div>

          <div>
            <Label infoText="" label="Mã bưu điện" />
            <CustomInput
              placeholder="Mã bưu điện"
              className="h-11"
              onChange={(e) => setValue('zipCode', e, { shouldValidate: true })}
              value={getValues('zipCode')}
            />
            <InputError error={errors.zipCode?.message} />
          </div>

          <div>
            <Label infoText="" label="Phường/xã" />
            <CustomSelect
              className=" h-11 !rounded"
              placeholder="Chọn phường/xã"
              onChange={(value) => {
                setValue('wardId', value, { shouldValidate: true });
              }}
              showSearch={true}
              options={wards?.data?.items?.map((ward) => ({
                value: ward.id,
                label: ward.name,
              }))}
              value={getValues('wardId')}
            />
            <InputError error={errors.wardId?.message} />
          </div>

          <div>
            <Label infoText="" label="Trạng thái" />
            <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
              <CustomRadio
                onChange={(value) =>
                  setValue('status', value, { shouldValidate: true })
                }
                options={[
                  { value: ECommonStatus.active, label: 'Hoạt động' },
                  { value: ECommonStatus.inactive, label: 'Ngưng hoạt động' },
                ]}
                value={getValues('status')}
              />
            </div>
          </div>
          <div>
            <Label infoText="" label="Địa chỉ 2" />
            <CustomInput
              placeholder="Nhập địa chỉ"
              className="h-11"
              onChange={(e) =>
                setValue('address2', e, { shouldValidate: true })
              }
              value={getValues('address2')}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <CustomCheckbox
            onChange={(e) =>
              setValue('isDefaultBranch', e.target.checked, {
                shouldValidate: true,
              })
            }
            checked={getValues('isDefaultBranch')}
          />{' '}
          Set chi nhánh mặc định
        </div>
      </div>
    </>
  );
}
