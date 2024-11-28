import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { deleteReturnProduct, getReturnProductDetail } from "@/api/return-product.service";
import CloseIcon from "@/assets/closeIcon.svg";
import PrintOrderIcon from "@/assets/printOrder.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EReturnProductStatus, EReturnProductStatusLabel } from "@/enums";
import { formatMoney, formatNumber, hasPermission } from "@/helpers";

import { message } from "antd";
import { useReactToPrint } from "react-to-print";
import type { IProduct, IRecord } from "../interface";
import CancleReturnProduct from "./CancleReturnProduct";
import InvoicePrint from "./InvoicePrint";
import styles from "./invoice.module.css";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

export function Info({ record }: { record: IRecord }) {
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);

  const invoiceComponentRef = useRef<HTMLDivElement>(null);
  const [openCancelPrintProduct, setOpenCancelPrintProduct] = useState(false);

  const { data: returnProductDetail, isLoading } = useQuery<{
    data: { purchaseReturn: IRecord; products: any };
  }>(["RETURN_PRODUCT_DETAIL", record.id], () => getReturnProductDetail(record.id));

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const columns: ColumnsType<IProduct> = [
    {
      title: "Mã hàng",
      dataIndex: "id",
      key: "id",
      render: (_, { product }) => <span className="cursor-pointer text-[#0070F4]">{product.code}</span>,
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
      render: (_, { product }) => product.name,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "productUnit",
      key: "productUnit",
      render: (productUnit) => productUnit?.unitName,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (money) => formatMoney(money),
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      key: "importPrice",
      render: (money) => formatMoney(+money),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (money) => formatMoney(money),
    },
  ];

  useEffect(() => {
    if (returnProductDetail?.data?.products) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      returnProductDetail?.data?.products?.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [returnProductDetail]);

  const { mutate: mutateCancelImportProduct, isLoading: isLoadingDeleteProduct } = useMutation(
    () => deleteReturnProduct(Number(record.id)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["LIST_RETURN_PRODUCT"]);
        setOpenCancelPrintProduct(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCancelImportProduct();
  };

  const totalQuantity = useMemo(() => {
    let total = 0;

    if (returnProductDetail) {
      returnProductDetail.data.products.forEach((product) => {
        total += product.quantity;
      });
    }

    return total;
  }, [returnProductDetail]);

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  return (
    <div className="gap-12 ">
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã trả hàng nhập:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.code}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div
            className={cx({
              "text-[#00B63E]": returnProductDetail?.data?.purchaseReturn?.status === EReturnProductStatus.SUCCEED,
              "text-gray-main": returnProductDetail?.data?.purchaseReturn?.status === EReturnProductStatus.DRAFT,
              "text-red-main": returnProductDetail?.data?.purchaseReturn?.status === EReturnProductStatus.CANCELLED,
            })}
          >
            {EReturnProductStatusLabel[returnProductDetail?.data?.purchaseReturn?.status as string]}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Nhà cung cấp:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.supplier?.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.createdAt}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người tạo:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.creator?.fullName}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Chi nhánh:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.branch?.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người trả:</div>
          <div className="text-black-main">{returnProductDetail?.data?.purchaseReturn?.user?.fullName}</div>
        </div>
      </div>

      <CustomTable
        dataSource={returnProductDetail?.data?.products?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: (record) => (
            <>
              {record.product?.isBatchExpireControl && (
                <div className="bg-[#FFF3E6] px-6 py-2 ">
                  <div className="flex items-center gap-x-3">
                    {record?.batches?.map(({ batch, quantity }) => (
                      <>
                        {batch && (
                          <div key={batch.id} className="flex items-center rounded bg-red-main py-1 px-2 text-white">
                            <span className="mr-2">
                              {batch.name} - {batch.expiryDate} - SL: {quantity}
                            </span>{" "}
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              )}
            </>
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />

      <div className="ml-auto mb-5 w-[380px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số lượng:</div>
          <div className="text-black-main">{formatNumber(totalQuantity)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số mặt hàng:</div>
          <div className="text-black-main">{returnProductDetail?.data?.products?.length}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng cộng:</div>
          <div className="text-black-main">{formatMoney(returnProductDetail?.data?.purchaseReturn?.totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá:</div>
          <div className="text-black-main">{formatMoney(returnProductDetail?.data?.purchaseReturn?.discount)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tiền đã trả NCC:</div>
          <div className="text-black-main">{formatMoney(returnProductDetail?.data?.purchaseReturn?.paid)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Nợ:</div>
          <div className="text-black-main">{formatMoney(returnProductDetail?.data?.purchaseReturn?.debt)}</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {/* <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={OpenOrderIcon} alt="" />}
        >
          Mở phiếu
        </CustomButton> */}

        {hasPermission(profile?.role?.permissions, RoleModel.return_product, RoleAction.delete) && (
          <CustomButton
            outline={true}
            prefixIcon={<Image src={CloseIcon} alt="" />}
            onClick={() => setOpenCancelPrintProduct(true)}
          >
            Hủy bỏ
          </CustomButton>
        )}
      </div>

      <CancleReturnProduct
        isOpen={openCancelPrintProduct}
        onCancel={() => setOpenCancelPrintProduct(false)}
        onSubmit={onSubmit}
        isLoading={isLoadingDeleteProduct}
      />

      <div ref={invoiceComponentRef} className={`${styles.invoicePrint} invoice-print`}>
        <InvoicePrint data={returnProductDetail?.data} columns={columns} totalQuantity={totalQuantity} />
      </div>
    </div>
  );
}
