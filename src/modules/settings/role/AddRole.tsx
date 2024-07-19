import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createRole, getRoleDetail, updateRole } from '@/api/role.service';
import { CustomButton } from '@/components/CustomButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import InputError from '@/components/InputError';

import { ROLE_DEFAULT, RoleLabel } from './role.enum';
import { schema } from './schema';

export function AddRole({ roleId }: { roleId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: roleDetail } = useQuery(
    ['ROLE_DETAIL', roleId],
    () => getRoleDetail(Number(roleId)),
    { enabled: !!roleId }
  );

  const [role, setRole] = useState(ROLE_DEFAULT);

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { mutate: mutateCreateRole, isLoading: isLoadingCreateRole } =
    useMutation(
      async () => {
        const permissions: { model: string; action: string }[] = [];

        Object.keys(role).forEach((key1) => {
          Object.keys(role[key1]).forEach((key2) => {
            if (role[key1][key2] === true && key2 !== 'all') {
              permissions.push({
                model: key1,
                action: key2,
              });
            }

            if (typeof role[key1][key2] === 'object') {
              Object.keys(role[key1][key2]).forEach((key3) => {
                if (role[key1][key2][key3] === true && key3 !== 'all') {
                  permissions.push({
                    model: key2,
                    action: key3,
                  });
                }
              });
            }
          });
        });

        return roleDetail
          ? updateRole(roleDetail?.data?.id, { ...getValues(), permissions })
          : createRole({
            ...getValues(),
            permissions,
          });
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['SETTING_ROLE']);

          router.push('/settings/role');
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateRole();
  };

  const onRoleChange = (name: string, value: boolean) => {
    const keys: any = name.split('.');
    const roleClone = JSON.parse(JSON.stringify(role));

    if (keys.length === 2) {
      if (keys[keys.length - 1] === 'all') {
        Object.keys(roleClone[keys[0]]).forEach((key1) => {
          if (typeof roleClone[keys[0]][key1] === 'object') {
            Object.keys(roleClone[keys[0]][key1]).forEach((key2) => {
              roleClone[keys[0]][key1][key2] = value;
            });
          } else {
            roleClone[keys[0]][key1] = value;
          }
        });
      } else {
        roleClone[keys[0]].all = false;
        roleClone[keys[0]][keys[1]] = value;
      }
      setRole(roleClone);
    }

    if (keys.length === 3) {
      if (keys[keys.length - 1] === 'all') {
        Object.keys(roleClone[keys[0]][keys[1]]).forEach((key2) => {
          roleClone[keys[0]][keys[1]][key2] = value;
        });
      } else {
        roleClone[keys[0]].all = false;
        roleClone[keys[0]][keys[1]].all = false;
        roleClone[keys[0]][keys[1]][keys[2]] = value;
      }
      setRole(roleClone);
    }
  };

  useEffect(() => {
    if (roleDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(roleDetail.data[key])) {
          setValue(key, roleDetail.data[key], { shouldValidate: true });
        }
      });

      const roleTemp = JSON.parse(JSON.stringify(ROLE_DEFAULT));

      Object.keys(roleTemp).forEach((key1) => {
        roleTemp[key1].all = true;

        Object.keys(roleTemp[key1]).forEach((key2) => {
          if (typeof roleTemp[key1][key2] === 'object') {
            roleTemp[key1][key2].all = true;
          }
        });
      });

      roleDetail?.data?.permissions?.forEach((permission) => {
        Object.keys(role).forEach((key1) => {
          if (key1 === permission.model) {
            Object.keys(role[key1]).forEach((key2) => {
              if (key2 === permission.action) {
                roleTemp[key1][key2] = true;
              }
            });
          }

          if (typeof role[key1] === 'object') {
            Object.keys(role[key1]).forEach((key2) => {
              if (key2 === permission.model) {
                Object.keys(role[key1][key2]).forEach((key3) => {
                  if (key3 === permission.action) {
                    roleTemp[key1][key2][key3] = true;
                  }
                });
              }
            });
          }
        });
      });

      Object.keys(roleTemp).forEach((key1) => {
        Object.keys(roleTemp[key1]).forEach((key2) => {
          if (typeof roleTemp[key1][key2] === 'object') {
            Object.keys(roleTemp[key1][key2]).forEach((key3) => {
              if (!roleTemp[key1][key2][key3] && key3 !== 'all') {
                roleTemp[key1][key2].all = false;
                roleTemp[key1].all = false;
              }
            });
          } else if (!roleTemp[key1][key2] && key2 !== 'all') {
            roleTemp[key1].all = false;
          }
        });
      });

      setRole(roleTemp);
    }
  }, [roleDetail]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {roleDetail ? 'Cập nhật vai trò' : 'Thêm mới vai trò'}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push('/settings/role')}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            disabled={isLoadingCreateRole}
            onClick={handleSubmit(onSubmit)}
            type="danger"
          >
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="mb-5  grow bg-white p-5">
        <div className="my-5 grid grid-cols-2 gap-x-[42px] gap-y-5" key="0 ">
          <div>
            <Label infoText="" label="Tên vài trò" required />
            <CustomInput
              placeholder="Nhập tên vai trò"
              className="h-11"
              onChange={(e) => setValue('name', e, { shouldValidate: true })}
              value={getValues('name')}
            />
            <InputError error={errors.name?.message} />
          </div>

          <div>
            <Label infoText="" label="Ghi chú" />
            <CustomInput
              placeholder="Nhập ghi chú"
              className="h-11"
              onChange={(e) =>
                setValue('description', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('description')}
            />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-10 bg-[#F7DADD] py-4 sticky top-0 z-10">
            <div className=" col-span-5 px-4 font-medium text-[#0F1824]">
              Tổng quan
            </div>
            <div className="col-span-1 px-4 font-medium text-[#0F1824]">
              Tất cả
            </div>
            <div className="col-span-1 px-4 font-medium text-[#0F1824]">
              Xem
            </div>
            <div className="col-span-1 px-4 font-medium text-[#0F1824]">
              Tạo
            </div>
            <div className="col-span-1 px-4 font-medium text-[#0F1824]">
              Sửa
            </div>
            <div className="col-span-1 px-4 font-medium text-[#0F1824]">
              Xóa
            </div>
          </div>

          {Object.keys(role).map((key1) => (
            <div
              key={key1}
              className="border-x border-b border-[#E8EAEB] pt-4 pb-2"
            >
              <div className="mb-2 grid  grid-cols-10">
                <div className=" col-span-5 px-4 font-medium text-[#0F1824]">
                  {RoleLabel[key1]}
                </div>

                {Object.keys(role[key1]).map((key2) => {
                  if (typeof role[key1][key2] === 'boolean') {
                    return (
                      <div
                        key={`${key1}.${key2}`}
                        className="col-span-1 px-4 font-medium text-[#0F1824]"
                      >
                        <CustomCheckbox
                          checked={role[key1][key2]}
                          onChange={(e) =>
                            onRoleChange(`${key1}.${key2}`, e.target.checked)
                          }
                        />
                      </div>
                    );
                  }

                  return <></>;
                })}
              </div>

              {Object.keys(role[key1]).map((key2) => {
                if (typeof role[key1][key2] === 'object') {
                  return (
                    <div key={`${key1}.${key2}`} className=" mb-2">
                      <div className="grid grid-cols-10  ">
                        <div className=" col-span-5 px-4 text-[#555770]">
                          {RoleLabel[key2]}
                        </div>

                        {Object.keys(role[key1][key2]).map((key3) => {
                          if (typeof role[key1][key2][key3] === 'boolean') {
                            return (
                              <div
                                key={`${key1}.${key2}.${key3}`}
                                className="col-span-1 px-4 font-medium text-[#0F1824]"
                              >
                                <CustomCheckbox
                                  checked={role[key1][key2][key3]}
                                  onChange={(e) =>
                                    onRoleChange(
                                      `${key1}.${key2}.${key3}`,
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            );
                          }

                          return <></>;
                        })}
                      </div>
                    </div>
                  );
                }

                return <></>;
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
