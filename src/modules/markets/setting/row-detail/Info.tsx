import Image from "next/image";

import { deleteConfigProduct, updateConfigStatus } from "@/api/market.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editWhite.svg";
import { CustomButton } from "@/components/CustomButton";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import { EProductSettingStatus, EProductSettingStatusLabel } from "@/enums";
import { formatDateTime, formatMoney, formatNumber, getImage, hasPermission, sliceString } from "@/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import cx from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import UpdateStatusModal from "@/components/CustomModal/ModalUpdateStatusItem";
export function Info({ record }: { record: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenUpdateStatus, setIsOpenUpdateStatus] = useState(false);

  const { mutate: mutateDeleteConfigProduct, isLoading } = useMutation(
    () => {
      return deleteConfigProduct(record?.id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CONFIG_PRODUCT"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const { mutate: mutateUpdaetConfigStatus, isLoading: isLoadingUpdateStatus } = useMutation(
    () => {
      return updateConfigStatus(record?.id, record?.status === "active" ? "inactive" : "active");
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CONFIG_PRODUCT"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const handleDelete = () => {
    mutateDeleteConfigProduct();
  };
  const handleUpdate = () => {
    mutateUpdaetConfigStatus();
  };
  return (
    <div className="gap-12 ">
      <div className="mb-10 flex gap-9">
        <div className="w-[223px] flex-shrink-0">
          <div className="mb-2  flex">
            <Image
              src={record?.imageCenter?.path ? getImage(record?.imageCenter?.path) : record?.imageCenter?.filePath}
              width={223}
              height={223}
              className="object-cover rounded-md border border-[#C9C6D9] py-1 overflow-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[223px]">
            {record?.images?.map((image, index) => (
              <div
                className="items-center rounded-md border border-[#C9C6D9] flex w-[70px] h-[70px] overflow-hidden "
                key={image?.id}
              >
                <Image
                  src={getImage(image?.path)}
                  width={70}
                  height={70}
                  className="object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 grid grow grid-cols-2 gap-4 gap-x-9">
          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Nhóm sản phẩm:</div>
            <div className="col-span-2 text-black-main line-clamp-1">{record?.product?.groupProduct?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Giá bán (VND):</div>
            <div className="col-span-2  text-black-main">{formatMoney(record?.price)}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Sản phẩm:</div>
            <div className="col-span-2 text-black-main line-clamp-1">{record?.product?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Giá khuyến mãi (VND):</div>
            <div className="col-span-2 text-black-main">
              {record?.discountPrice > 0 ? formatMoney(record?.discountPrice) : ""}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Loại chợ:</div>
            <div className="col-span-2 text-black-main">
              {record?.marketType === "common" ? "Chợ chung" : "Chợ riêng"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="col-span-2 text-black-main">{record?.userCreated?.fullName}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className="col-span-2">
              <div
                className={cx(
                  record?.status === EProductSettingStatus.active
                    ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
                    : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
                  "px-2 py-1 rounded-2xl w-max",
                )}
              >
                {EProductSettingStatusLabel[record?.status]}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Thời gian cập nhật cuối:</div>
            <div className="col-span-2 text-black-main">{formatDateTime(record?.updatedAt)}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Số lượng tồn:</div>
            <div className="col-span-2 text-black-main">{formatNumber(+record?.quantity - +record?.quantitySold)}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Người cập nhật cuối:</div>
            <div className="col-span-2 text-black-main">{record?.userUpdated?.fullName}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Số lượng đã bán:</div>
            <div className="col-span-2 text-black-main">{formatNumber(record?.quantitySold)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.market_setting, RoleAction.update) && (
          <CustomButton
            outline={true}
            prefixIcon={<Image src={DeleteIcon} alt="" />}
            onClick={() => setIsOpenDelete(true)}
          >
            Xóa
          </CustomButton>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.market_setting, RoleAction.delete) && (
          <CustomButton
            outline={true}
            onClick={() => setIsOpenUpdateStatus(true)}
            type={record?.status === "active" ? "disable" : "success"}
          >
            {record?.status === "active" ? "Ngưng bán" : "Mở bán"}
          </CustomButton>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.market_setting, RoleAction.update) && (
          <CustomButton
            type="success"
            prefixIcon={<Image src={EditIcon} alt="" />}
            onClick={() => router.push(`/markets/setting/add-setting?id=${record?.id}`)}
          >
            Cập nhật
          </CustomButton>
        )}
      </div>

      <DeleteModal
        isOpen={isOpenDelete}
        onCancel={() => setIsOpenDelete(false)}
        onSuccess={() => {
          handleDelete();
          setIsOpenDelete(false);
        }}
        content={"cấu hình sản phẩm"}
        isLoading={isLoading}
      />
      <UpdateStatusModal
        isOpen={isOpenUpdateStatus}
        onCancel={() => setIsOpenUpdateStatus(false)}
        onSuccess={() => {
          handleUpdate();
          setIsOpenUpdateStatus(false);
        }}
        content={"trạng thái sản phẩm"}
        isLoading={isLoadingUpdateStatus}
      />
    </div>
  );
}
