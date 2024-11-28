import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Barcode from "react-jsbarcode";

import { deleteProduct, updateProductStatus } from "@/api/product.service";
import BarcodeBlueIcon from "@/assets/barcodeBlue.svg";
import CopyBlueIcon from "@/assets/copyBlue.svg";
import DeleteRedIcon from "@/assets/deleteRed.svg";
import EditWhiteIcon from "@/assets/editWhite.svg";
import LockGrayIcon from "@/assets/lockGray.svg";
import MarketBlueIcon from "@/assets/marketBlue.svg";
import { CustomButton } from "@/components/CustomButton";
import UpdateStatusModal from "@/components/CustomModal/ModalUpdateStatusItem";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import { EProductStatus, EProductStatusLabel, EProductType, getEnumKeyByValue } from "@/enums";
import { formatMoney, getImage, hasPermission } from "@/helpers";
import parse from "html-react-parser";
import type { IProduct } from "../types";
import DeleteProductModal from "./DeleteProduct";
import PrintBarcodeModal from "./PrintBarcodeModal";
import ListUnit from "../ListUnit";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

const Info = ({ record, onChangeUnit }: { record: IProduct; onChangeUnit: any }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const profile = useRecoilValue(profileState);

  const [openPrintBarcodeModal, setOpenPrintBarcodeModal] = useState(false);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  const [openUpdateProductStatusModal, setOpenUpdateProductStatusModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const { mutate: mutateDeleteProduct, isLoading: isLoadingDeleteProduct } = useMutation(
    () => deleteProduct(Number(record.id)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["LIST_PRODUCT"]);
        setOpenDeleteProductModal(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteProduct();
  };

  const { mutate: mutateUpdateStatusProduct, isLoading: isLoadingUpdateStatusProduct } = useMutation(
    (payload: { status: EProductStatus }) => updateProductStatus(Number(record.id), payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["LIST_PRODUCT"]);
        setOpenUpdateProductStatusModal(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmitUpdateStatus = (status: EProductStatus) => {
    mutateUpdateStatusProduct({ status });
  };

  const redirectUpdate = () => {
    if (record.type === EProductType.MEDICINE) {
      router.push(`/products/list/add-medicine?id=${record.id}`);
    } else if (record.type === EProductType.PACKAGE) {
      router.push(`/products/list/add-package?id=${record.id}`);
    } else {
      router.push(`/products/list/add-combo?id=${record.id}`);
    }
  };

  const redirectCopy = () => {
    if (record.type === EProductType.MEDICINE) {
      router.push(`/products/list/add-medicine?id=${record.id}&copy=true`);
    } else if (record.type === EProductType.PACKAGE) {
      router.push(`/products/list/add-package?id=${record.id}&copy=true`);
    } else {
      router.push(`/products/list/add-combo?id=${record.id}&copy=true`);
    }
  };

  const handlePrintBarcode = () => {
    setOpenPrintBarcodeModal(true);
  };

  return (
    <>
      <div className="bg-[#F5F5F5] p-4 text-lg font-medium text-[#0070F4]">{record?.name}</div>
      <div className="flex gap-12">
        <div className="flex flex-col gap-5 p-5">
          {record?.image?.path || record?.imageUrl ? (
            <Image
              width={235}
              height={235}
              src={getImage(record?.image?.path) || record?.imageUrl}
              alt=""
              objectFit="contain"
            />
          ) : (
            <div className="h-[235px] w-[235px]" />
          )}
          {record?.barCode && <Barcode className=" mx-auto h-[110px]" value={record?.barCode} />}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã hàng:</div>
            <div className="text-black-main">{record?.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã vạch:</div>
            <div className="text-black-main">{record?.barCode}</div>
          </div>
          {record?.type === EProductType.MEDICINE && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Mã thuốc:</div>
              <div className="text-black-main">{record?.drugCode}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Nhóm hàng: </div>
            <div className="text-black-main">{record?.groupProduct?.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Loại hàng:</div>
            <div className="text-black-main">
              {record?.type === 1 ? "Thuốc" : record?.type === 2 ? "Hàng hóa" : "Combo - đóng gói"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Tên hàng:</div>
            <div className="text-black-main">{record?.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Tên viết tắt:</div>
            <div className="text-black-main">{record?.shortName}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Giá bán:</div>
            <div className="text-black-main">{formatMoney(record?.price)}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Giá vốn:</div>
            <div className="text-black-main">{formatMoney(record?.primePrice)}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trọng lượng:</div>
            <div className="text-black-main">{record?.weight}</div>
          </div>
          {record?.type === EProductType.MEDICINE && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Đường dùng:</div>
              <div className="text-black-main">{record?.productDosage?.name}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Vị trí:</div>
            <div className="text-black-main">{record?.productPosition?.name}</div>
          </div>
          {/* <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Cảnh báo hết hạn:</div>
            <div className="text-black-main">
              {record?.warningExpiryDate || record?.warningExpiryText}
            </div>
          </div> */}
          {record?.type === EProductType.MEDICINE && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Số đăng ký:</div>
              <div className="text-black-main">{record?.registerNumber}</div>
            </div>
          )}
          {record?.type === EProductType.MEDICINE && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Hoạt chất:</div>
              <div className="text-black-main">{record?.activeElement}</div>
            </div>
          )}
          {record?.type === EProductType.MEDICINE && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Hàm lượng:</div>
              <div className="text-black-main">{record?.content}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Hãng sản xuất:</div>
            <div className="text-black-main">{record?.productManufacture?.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Nước sản xuất:</div>
            <div className="text-black-main">{record?.country?.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Quy cách đóng gói:</div>
            <div className="text-black-main">{record?.packingSpecification}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mô tả:</div>
            <div className="text-black-main">
              <div className={showFullDescription ? "" : "line-clamp-5"}>{parse(record?.description ?? "")}</div>
              {record?.description?.length > 240 && (
                <button onClick={toggleDescription} className="text-blue-500">
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Danh sách đơn vị:</div>
            <div className="text-black-main">
              {/* <CustomUnitSelect
                options={record?.productUnit?.map((item) => ({
                  value: item.id,
                  label: item.unitName,
                }))}
                value={
                  record?.productUnit?.find((unit) => unit.isBaseUnit)?.id ||
                  record?.productUnit[0]?.id
                }
              /> */}
              <ListUnit data={record?.productUnit} onChangeUnit={onChangeUnit} record={record} isDetailOpen={true} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className={`${record?.status === EProductStatus.active ? "text-[#00B63E]" : "text-gray-main"}`}>
              {EProductStatusLabel[getEnumKeyByValue(EProductStatus, record?.status)]}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.update) && (
          <CustomButton
            type={record?.status === EProductStatus.inactive ? "success" : "disable"}
            outline={true}
            prefixIcon={record?.status === EProductStatus.inactive ? <div></div> : <Image src={LockGrayIcon} alt="" />}
            onClick={() => setOpenUpdateProductStatusModal(true)}
            disabled={isLoadingUpdateStatusProduct}
          >
            {record?.status === EProductStatus.inactive ? "Mở bán" : "Ngưng kinh doanh"}
          </CustomButton>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.delete) && (
          <CustomButton
            outline={true}
            onClick={() => setOpenDeleteProductModal(true)}
            prefixIcon={<Image src={DeleteRedIcon} alt="" />}
          >
            Xoá
          </CustomButton>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.update) && (
          <CustomButton type="success" prefixIcon={<Image src={EditWhiteIcon} alt="" />} onClick={redirectUpdate}>
            Cập nhật
          </CustomButton>
        )}
      </div>

      <PrintBarcodeModal
        isOpen={openPrintBarcodeModal}
        onCancel={() => setOpenPrintBarcodeModal(false)}
        barCode={record?.barCode}
      />

      <DeleteProductModal
        isOpen={openDeleteProductModal}
        onCancel={() => setOpenDeleteProductModal(false)}
        onSubmit={onSubmit}
        isLoading={isLoadingDeleteProduct}
      />

      <UpdateStatusModal
        isOpen={openUpdateProductStatusModal}
        onCancel={() => setOpenUpdateProductStatusModal(false)}
        onSuccess={() =>
          onSubmitUpdateStatus(
            record?.status === EProductStatus.active ? EProductStatus.inactive : EProductStatus.active,
          )
        }
        content="sản phẩm"
      />
    </>
  );
};

export default Info;
