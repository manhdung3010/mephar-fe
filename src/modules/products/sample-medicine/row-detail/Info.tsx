import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { deleteSampleMedicine } from "@/api/product.service";
import DeleteRedIcon from "@/assets/deleteRed.svg";
import EditWhiteIcon from "@/assets/editWhite.svg";
import ExportFile from "@/assets/exportFileIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomTextarea } from "@/components/CustomInput";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import CustomTable from "@/components/CustomTable";
import { ECommonStatus, ECommonStatusLabel, getEnumKeyByValue } from "@/enums";
import { formatMoney, formatNumber } from "@/helpers";

const Info = ({ record }) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  console.log(record);

  const {
    mutate: mutateDeleteSampleMedicine,
    isLoading: isLoadingDeleteSampleMedicine,
  } = useMutation(() => deleteSampleMedicine(Number(record.id)), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["LIST_SAMPLE_MEDICINE"]);
      setOpenDeleteModal(false);
    },
    onError: (err: any) => {
      message.error(err?.message);
    },
  });

  const onSubmit = () => {
    mutateDeleteSampleMedicine();
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      render: (_, { product }) => product?.code,
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
      render: (_, { product }) => product?.name,
    },
    {
      title: "liều dùng",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Đơn vị",
      dataIndex: "units",
      key: "units",
      render: (_, { productUnit }) => productUnit?.unitName,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (_, { productUnit }) => formatMoney(productUnit?.price),
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      key: "price",
      render: (_value, { productUnit, quantity }) =>
        formatMoney(productUnit?.price * quantity),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5">
        <div className="col-span-2 grid flex-1 grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã đơn thuốc:</div>
            <div className="text-black-main">{record.code}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Tên đơn thuốc:</div>
            <div className="text-black-main">{record.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Vị trí:</div>
            <div className="text-black-main">{record.position?.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">{record.user?.fullName}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div
              className={`${
                record.status === ECommonStatus.active
                  ? "text-[#00B63E]"
                  : "text-gray-main"
              }`}
            >
              {
                ECommonStatusLabel[
                  getEnumKeyByValue(ECommonStatus, record.status)
                ]
              }
            </div>
          </div>
        </div>

        <CustomTextarea
          className="col-span-1"
          value={record.description}
          readOnly
        />
      </div>

      <CustomTable
        columns={columns}
        dataSource={record.products}
        className="my-8"
        pagination={false}
      />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="success"
          prefixIcon={<Image src={EditWhiteIcon} alt="" />}
          onClick={() => {
            router.push(
              `/products/sample-medicine/add-sample-medicine?id=${record.id}`
            );
          }}
        >
          Cập nhật
        </CustomButton>

        <CustomButton
          outline={true}
          type="disable"
          prefixIcon={<Image src={ExportFile} alt="" />}
        >
          Xuất file
        </CustomButton>

        <CustomButton
          outline={true}
          prefixIcon={<Image src={DeleteRedIcon} alt="" />}
          onClick={() => setOpenDeleteModal(true)}
        >
          Xoá
        </CustomButton>
      </div>

      <DeleteModal
        isOpen={!!openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onSuccess={onSubmit}
        content="đơn thuốc mẫu"
        isLoading={isLoadingDeleteSampleMedicine}
      />
    </>
  );
};

export default Info;
