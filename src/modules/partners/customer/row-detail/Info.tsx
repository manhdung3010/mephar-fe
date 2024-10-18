import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { deleteCustomer, updateCustomer, updateStatusCustomer } from "@/api/customer.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editWhite.svg";
import LockIcon from "@/assets/lockGray.svg";
import { CustomButton } from "@/components/CustomButton";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";

import { ECustomerStatus, ECustomerStatusLabel } from "@/enums";
import type { ICustomer } from "../type";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import UpdateStatusModal from "./UpdateStatusModal";

const { TextArea } = Input;

export function Info({ record }: { record: ICustomer }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);

  const [deletedId, setDeletedId] = useState<number>();
  const [openStatus, setOpenStatus] = useState<boolean>(false);

  const { mutate: mutateDeleteCustomer, isLoading: isLoadingDeleteCustomer } = useMutation(
    () => deleteCustomer(Number(deletedId)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const { mutate: mutateUpdateCustomer, isLoading: isLoadingUpdateCustomer } = useMutation(
    (data: { id: number; status: ECustomerStatus }) => updateStatusCustomer(Number(data.id), { status: data?.status }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteCustomer();
  };

  const handleUpdateStatus = (id: number, status: ECustomerStatus) => {
    // mutateUpdateCustomer({ id, status });
    setOpenStatus(true);
  };

  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Mã khách hàng:</div>
            <div className="text-black-main">{record.code}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Điện thoại:</div>
            <div className="text-black-main">{record.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Tên khách:</div>
            <div className="text-black-main">{record.fullName}</div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Địa chỉ:</div>
            <div>
              <div className="text-black-main">{record.address}</div>
              <div className="text-[#0096FF]">
                <span className="text-[#0096FF]">{record.lat} N </span>
                <span className="text-[#0096FF]">{record.lng} E</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Facebook:</div>
            <div className="text-black-main">{record.facebook}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Ngày sinh:</div>
            <div className="text-black-main">{record.birthday}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Phường/xã:</div>
            <div className="text-black-main">{record.ward?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Nhóm KH:</div>
            <div className="text-black-main">
              {record?.listGroupCustomer?.map((item, index) => {
                return item?.groupCustomer?.name + (index < record?.listGroupCustomer?.length - 1 ? ", " : "");
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Quận/huyện:</div>
            <div className="text-black-main">{record.district?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Tên công ty:</div>
            <div className="text-black-main">{record.companyName}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Mã số thuế:</div>
            <div className="text-black-main">{record.taxCode}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Tỉnh/Thành phố:</div>
            <div className="text-black-main">{record.province?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Email:</div>
            <div className="text-black-main">{record.email}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Người tạo:</div>
            <div className="text-black-main">{record?.created_by?.username}</div>
          </div>

          <div className="grid grid-cols-3 gap-5"></div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">{record.createdAt}</div>
          </div>
        </div>

        <div className="grow">
          <TextArea rows={8} placeholder="Ghi chú:" value={record?.note} disabled />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.update) && (
          <CustomButton
            type={String(record?.status) === ECustomerStatus.active ? `disable` : "success"}
            outline={true}
            // prefixIcon={<Image src={LockIcon} alt="" />}
            loading={isLoadingUpdateCustomer}
            disabled={isLoadingUpdateCustomer}
            onClick={() =>
              handleUpdateStatus(
                record.id as any,
                String(record?.status) === ECustomerStatus.active ? ECustomerStatus.inactive : ECustomerStatus.active,
              )
            }
          >
            {String(record?.status) === ECustomerStatus.active
              ? ECustomerStatusLabel.inactive
              : ECustomerStatusLabel.active}
          </CustomButton>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.delete) && (
          <CustomButton
            type="danger"
            outline={true}
            prefixIcon={<Image src={DeleteIcon} alt="" />}
            onClick={() => setDeletedId(record.id)}
          >
            Xóa
          </CustomButton>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.update) && (
          <CustomButton
            type="success"
            prefixIcon={<Image src={EditIcon} alt="" />}
            onClick={() => router.push(`/partners/customer/add-customer?id=${record.id}`)}
          >
            Cập nhật
          </CustomButton>
        )}
      </div>

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="khách hàng"
        isLoading={isLoadingDeleteCustomer}
      />
      <UpdateStatusModal
        isOpen={openStatus}
        onCancel={() => setOpenStatus(false)}
        onSuccess={() => {
          mutateUpdateCustomer({
            id: record.id,
            status:
              String(record?.status) === ECustomerStatus.active ? ECustomerStatus.inactive : ECustomerStatus.active,
          });
          setOpenStatus(false);
        }}
        content="khách hàng"
      />
    </div>
  );
}
