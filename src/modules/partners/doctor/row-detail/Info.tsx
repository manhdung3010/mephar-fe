import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteDoctor } from '@/api/doctor.service';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editWhite.svg';
import LockIcon from '@/assets/lockGray.svg';
import { CustomButton } from '@/components/CustomButton';
import DeleteModal from '@/components/CustomModal/ModalDeleteItem';
import { EGenderLabel } from '@/enums';

import type { IRecord } from '..';
import { hasPermission } from '@/helpers';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';

const { TextArea } = Input;

export function Info({ record }: { record: IRecord }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);

  const [deletedId, setDeletedId] = useState<number>();

  const { mutate: mutateDeleteDoctor, isLoading: isLoadingDeleteDoctor } =
    useMutation(() => deleteDoctor(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['DOCTOR_LIST']);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteDoctor();
  };

  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Mã bác sĩ:</div>
            <div className="text-black-main">{record.code}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Điện thoại:</div>
            <div className="text-black-main">{record.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Tên bác sĩ:</div>
            <div className="text-black-main">{record.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Email:</div>
            <div className="text-black-main">{record.email}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Giới tính:</div>
            <div className="text-black-main">{EGenderLabel[record.gender]}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Địa chỉ:</div>
            <div className="text-black-main">{record.address}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Chuyên khoa:</div>
            <div className="text-black-main">{record.specialist?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Phường/xã:</div>
            <div className="text-black-main">{record.ward?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Trình độ:</div>
            <div className="text-black-main">{record.level?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Quận/huyện:</div>
            <div className="text-black-main">{record.district?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Nơi công tác:</div>
            <div className="text-black-main">{record.workPlace?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Tỉnh/Thành phố:</div>
            <div className="text-black-main">{record.province?.name}</div>
          </div>
        </div>

        <div className="grow">
          <TextArea
            rows={8}
            placeholder="Ghi chú:"
            value={record.note}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {
          hasPermission(profile?.role?.permissions, RoleModel.doctor, RoleAction.update) && (
            <CustomButton
              type="disable"
              outline={true}
              prefixIcon={<Image src={LockIcon} alt="" />}
            >
              Ngưng hoạt động
            </CustomButton>
          )
        }
        {
          hasPermission(profile?.role?.permissions, RoleModel.doctor, RoleAction.delete) && (
            <CustomButton
              type="danger"
              outline={true}
              prefixIcon={<Image src={DeleteIcon} alt="" />}
              onClick={() => setDeletedId(record.id)}
            >
              Xóa
            </CustomButton>
          )
        }
        {
          hasPermission(profile?.role?.permissions, RoleModel.doctor, RoleAction.update) && (
            <CustomButton
              type="success"
              prefixIcon={<Image src={EditIcon} alt="" />}
              onClick={() =>
                router.push(`/partners/doctor/add-doctor?id=${record.id}`)
              }
            >
              Cập nhật
            </CustomButton>
          )
        }
      </div>

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="bác sĩ"
        isLoading={isLoadingDeleteDoctor}
      />
    </div>
  );
}
