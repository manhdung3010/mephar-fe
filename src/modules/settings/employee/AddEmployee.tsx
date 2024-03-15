import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { getBranch } from '@/api/branch.service';
import {
  createEmployee,
  getEmployeeDetail,
  updateEmployee,
} from '@/api/employee.service';
import { getRole } from '@/api/role.service';
import { CustomButton } from '@/components/CustomButton';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';
import Tab from '@/components/CustomTab';
import InputError from '@/components/InputError';
import { EUserPositions, EUserPositionsLabel } from '@/enums';
import { formatDate } from '@/helpers';

import { schema } from './schema';

export function AddEmployee({ employeeId }: { employeeId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: employeeDetail } = useQuery(
    ['EMPLOYEE_DETAIL', employeeId],
    () => getEmployeeDetail(Number(employeeId)),
    { enabled: !!employeeId }
  );
  const { data: branches } = useQuery(['SETTING_BRANCH'], () =>
    getBranch({ page: 1, limit: 20 })
  );
  const { data: roles } = useQuery(['SETTING_ROLES'], () =>
    getRole({ page: 1, limit: 20 })
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { mutate: mutateCreateEmployee, isLoading: isLoadingCreateEmployee } =
    useMutation(
      () => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { confirmPassword, ...payload } = getValues();
        return employeeDetail
          ? updateEmployee(employeeDetail?.data?.id, getValues())
          : createEmployee(payload);
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['SETTING_EMPLOYEE']);
          reset();

          setTimeout(() => {
            router.push('/settings/employee');
          }, 1000);
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateEmployee();
  };

  useEffect(() => {
    if (employeeDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(employeeDetail.data[key])) {
          setValue(key, employeeDetail.data[key], { shouldValidate: true });
        }
      });
      setValue('branchId', employeeDetail?.data?.branch?.id, {
        shouldValidate: true,
      });
    }
  }, [employeeDetail]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {employeeDetail ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push('/settings/employee')}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            disabled={isLoadingCreateEmployee}
            type="danger"
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="grow  bg-white p-5">
        <Tab
          menu={['Thông tin nhân viên']}
          components={[
            <div className="my-5 grid grid-cols-2 gap-x-[42px] gap-y-5" key="0">
              <div>
                <Label infoText="" label="Họ và tên nhân viên" required />
                <CustomInput
                  placeholder="Họ và tên"
                  className="h-11"
                  onChange={(e) =>
                    setValue('fullName', e, {
                      shouldValidate: true,
                    })
                  }
                  value={getValues('fullName')}
                />
                <InputError error={errors.fullName?.message} />
              </div>

              <div>
                <Label infoText="" label="Tên đăng nhập" required />
                <CustomInput
                  placeholder="Tên"
                  className="h-11"
                  onChange={(e) =>
                    setValue('username', e, {
                      shouldValidate: true,
                    })
                  }
                  value={getValues('username')}
                />
                <InputError error={errors.username?.message} />
              </div>

              <div>
                <Label infoText="" label="Mật khẩu" required />
                <CustomInput
                  placeholder="Mật khẩu"
                  type="password"
                  className="h-11"
                  onChange={(e) =>
                    setValue('password', e, {
                      shouldValidate: true,
                    })
                  }
                />
                <InputError error={errors.password?.message} />
              </div>

              <div>
                <Label infoText="" label="Nhập lại" required />
                <CustomInput
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  className="h-11"
                  onChange={(e) =>
                    setValue('confirmPassword', e, {
                      shouldValidate: true,
                    })
                  }
                />
                <InputError error={errors.confirmPassword?.message} />
              </div>

              <div>
                <Label infoText="" label="Số điện thoại" required />
                <CustomInput
                  placeholder="Nhập sđt"
                  className="h-11"
                  onChange={(e) =>
                    setValue('phone', e, { shouldValidate: true })
                  }
                  value={getValues('phone')}
                />
                <InputError error={errors.phone?.message} />
              </div>

              <div>
                <Label infoText="" label="Email" />
                <CustomInput
                  placeholder="Nhập email"
                  className="h-11"
                  onChange={(e) =>
                    setValue('email', e, { shouldValidate: true })
                  }
                  value={getValues('email')}
                />
                <InputError error={errors.email?.message} />
              </div>

              <div>
                <Label infoText="" label="Ngày sinh" />
                <CustomDatePicker
                  className="h-11 w-full"
                  placeholder=""
                  onChange={(value) =>
                    setValue('birthday', formatDate(value, 'YYYY-MM-DD'), {
                      shouldValidate: true,
                    })
                  }
                  value={getValues('birthday')}
                />
                <InputError error={errors.birthday?.message} />
              </div>

              <div>
                <Label infoText="" label="Địa chỉ" />
                <CustomInput
                  placeholder="Nhập địa chỉ"
                  className="h-11"
                  onChange={(e) =>
                    setValue('address', e, {
                      shouldValidate: true,
                    })
                  }
                  value={getValues('address')}
                />
                <InputError error={errors.address?.message} />
              </div>
            </div>,
          ]}
        />

        <Tab
          menu={['Thông tin nhân viên']}
          components={[
            <div
              className="my-5 grid grid-cols-2 gap-x-[42px] gap-y-5"
              key="0 "
            >
              <div>
                <Label infoText="" label="Vai trò" />
                <CustomSelect
                  onChange={(value) =>
                    setValue('roleId', value, { shouldValidate: true })
                  }
                  options={roles?.data?.items?.map((role) => ({
                    value: role.id,
                    label: role.name,
                  }))}
                  value={getValues('roleId')}
                  placeholder="Chọn vai trò"
                  className="h-11 !rounded"
                />
                <InputError error={errors.roleId?.message} />
              </div>

              <div>
                <Label infoText="" label="Chi nhánh" required />
                <CustomSelect
                  placeholder="Chọn chi nhánh"
                  className="h-11 !rounded"
                  onChange={(value) =>
                    setValue('branchId', value, { shouldValidate: true })
                  }
                  options={branches?.data?.items?.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
                  value={getValues('branchId')}
                />
                <InputError error={errors.branchId?.message} />
              </div>

              <div>
                <Label infoText="" label="Vị trí" />
                <CustomSelect
                  onChange={(value) =>
                    setValue('position', value, { shouldValidate: true })
                  }
                  options={Object.keys(EUserPositions).map((position) => ({
                    value: position,
                    label: EUserPositionsLabel[position],
                  }))}
                  value={getValues('position')}
                  placeholder="Chọn vị trí"
                  className="h-11 !rounded"
                />
                <InputError error={errors.position?.message} />
              </div>
            </div>,
          ]}
        />
      </div>
    </>
  );
}
