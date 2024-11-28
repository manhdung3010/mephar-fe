import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";
import { deleteImportProduct, getImportProductDetail } from "@/api/import-product.service";
import BarcodeBlueIcon from "@/assets/barcodeBlue.svg";
import CloseIcon from "@/assets/closeIcon.svg";
import OpenOrderIcon from "@/assets/openOrder.svg";
import PlusIcon from "@/assets/PlusIconWhite.svg";
import PrintOrderIcon from "@/assets/printOrder.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EImportProductStatus, EImportProductStatusLabel } from "@/enums";
import { formatMoney, formatNumber, hasPermission } from "@/helpers";
import PrintBarcodeModal from "../../list-product/row-detail/PrintBarcodeModal";

import type { IProduct, IRecord } from "../interface";
import CancelProductModal from "./CancelProduct";
import { useRouter } from "next/router";
import InvoicePrint from "./InvoicePrint";
import { useReactToPrint } from "react-to-print";
import styles from "./invoice.module.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { productReturnState, profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

export function Info({ record }: { record: IRecord }) {
  const [openPrintBarcodeModal, setOpenPrintBarcodeModal] = useState(false);
  const [openCancelPrintProduct, setOpenCancelPrintProduct] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);
  const [returnProducts, setReturnProducts] = useRecoilState(productReturnState);

  const { data: importProductDetail, isLoading } = useQuery<{
    data: { inbound: IRecord; products: any };
  }>(["IMPORT_PRODUCT_DETAIL", record.id], () => getImportProductDetail(record.id));

  const handleOpenOrderClick = () => {
    router.push(`/products/import/coupon/?id=${record.id}`);
  };
  const invoiceComponentRef = useRef(null);

  const { mutate: mutateCancelImportProduct, isLoading: isLoadingDeleteProduct } = useMutation(
    () => deleteImportProduct(Number(record.id)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["LIST_IMPORT_PRODUCT"]);
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
      title: "Đơn vị",
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
    // {
    //   title: 'Đơn giá',
    //   dataIndex: 'importPrice',
    //   key: 'importPrice',
    // },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => formatMoney(discount),
    },
    {
      title: "Giá nhập",
      dataIndex: "price",
      key: "price",
      render: (price) => formatMoney(+price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, record: any) => formatMoney(record.price * record.quantity - record.discount),
    },
  ];

  useEffect(() => {
    if (importProductDetail?.data?.products) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      importProductDetail?.data?.products?.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [importProductDetail]);

  const totalQuantity = useMemo(() => {
    let total = 0;

    if (importProductDetail) {
      importProductDetail.data.products.forEach((product) => {
        total += product.quantity;
      });
    }

    return total;
  }, [importProductDetail]);

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  const handleRouterReturn = () => {
    setReturnProducts([]);
    router.push(`/products/return/coupon/?id=${record.id}`);
  };

  return (
    <div className="gap-12 ">
      <div ref={invoiceComponentRef} className={`${styles.invoicePrint} invoice-print`}>
        <InvoicePrint data={importProductDetail?.data} columns={columns} totalQuantity={totalQuantity} />
      </div>
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã nhập hàng:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.code}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div
            className={`${
              importProductDetail?.data?.inbound?.status === EImportProductStatus.SUCCEED
                ? "text-[#00B63E]"
                : "text-gray-main"
            }`}
          >
            {EImportProductStatusLabel[importProductDetail?.data?.inbound?.status as string]}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Nhà cung cấp:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.supplier?.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.createdAt}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người tạo:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.creator?.fullName}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Chi nhánh:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.branch?.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người nhập:</div>
          <div className="text-black-main">{importProductDetail?.data?.inbound?.user?.fullName}</div>
        </div>
      </div>

      <CustomTable
        dataSource={importProductDetail?.data?.products?.map((item, index) => ({
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
          <div className="text-black-main">{importProductDetail?.data?.products?.length}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng cộng:</div>
          <div className="text-black-main">{formatMoney(importProductDetail?.data?.inbound?.totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá:</div>
          <div className="text-black-main">{formatMoney(importProductDetail?.data?.inbound?.discount)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tiền đã trả NCC:</div>
          <div className="text-black-main">{formatMoney(importProductDetail?.data?.inbound?.paid)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Nợ:</div>
          <div className="text-black-main">{formatMoney(importProductDetail?.data?.inbound?.debt)}</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.import_product, RoleAction.delete) && (
          <CustomButton
            outline={true}
            prefixIcon={<Image src={CloseIcon} alt="" />}
            onClick={() => setOpenCancelPrintProduct(true)}
          >
            Hủy bỏ
          </CustomButton>
        )}
      </div>

      <CancelProductModal
        isOpen={openCancelPrintProduct}
        onCancel={() => setOpenCancelPrintProduct(false)}
        onSubmit={onSubmit}
        isLoading={isLoadingDeleteProduct}
      />

      <PrintBarcodeModal
        isOpen={openPrintBarcodeModal}
        onCancel={() => setOpenPrintBarcodeModal(false)}
        barCode={record?.code}
      />
    </div>
  );
}
