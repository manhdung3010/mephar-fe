import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { getImportProductDetail } from '@/api/import-product.service';
import BarcodeBlueIcon from '@/assets/barcodeBlue.svg';
import CloseIcon from '@/assets/closeIcon.svg';
import OpenOrderIcon from '@/assets/openOrder.svg';
import PlusIcon from '@/assets/PlusIconWhite.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EImportProductStatus, EImportProductStatusLabel } from '@/enums';
import { formatMoney, formatNumber } from '@/helpers';

import type { IProduct, IRecord } from '../interface';

export function Info({ record }: { record: IRecord }) {
  const { data: importProductDetail, isLoading } = useQuery<{
    data: { inbound: IRecord; products: any };
  }>(['IMPORT_PRODUCT_DETAIL', record.id], () =>
    getImportProductDetail(record.id)
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IProduct> = [
    {
      title: 'Mã hàng',
      dataIndex: 'id',
      key: 'id',
      render: (_, { product }) => (
        <span className="cursor-pointer text-[#0070F4]">{product.code}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (_, { product }) => product.name,
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      render: (_, { productBatchHistories }) =>
        formatNumber(
          productBatchHistories.reduce((acc, obj) => acc + obj.quantity, 0)
        ),
    },
    // {
    //   title: 'Đơn giá',
    //   dataIndex: 'importPrice',
    //   key: 'importPrice',
    // },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (_, { productBatchHistories }) =>
        formatMoney(productBatchHistories[0]?.discount),
    },
    {
      title: 'Giá nhập',
      dataIndex: 'importPrice',
      key: 'importPrice',
      render: (_, { productBatchHistories }) =>
        formatMoney(productBatchHistories[0]?.importPrice),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, { productBatchHistories }) =>
        formatMoney(productBatchHistories[0]?.totalPrice),
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
        product.productBatchHistories.forEach((batch) => {
          total += batch.quantity;
        });
      });
    }

    return total;
  }, [importProductDetail]);

  return (
    <div className="gap-12 ">
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã nhập hàng:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.code}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div
            className={`${
              importProductDetail?.data?.inbound?.status ===
              EImportProductStatus.SUCCEED
                ? 'text-[#00B63E]'
                : 'text-gray-main'
            }`}
          >
            {
              EImportProductStatusLabel[
                importProductDetail?.data?.inbound?.status as string
              ]
            }
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Nhà cung cấp:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.supplier?.name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.createdAt}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người tạo:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.creator?.fullName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Chi nhánh:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.branch?.name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người trả:</div>
          <div className="text-black-main">
            {importProductDetail?.data?.inbound?.user?.fullName}
          </div>
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
                    {record?.productBatchHistories?.map(
                      ({ batch, quantity }) => (
                        <>
                          {batch && (
                            <div
                              key={batch.id}
                              className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                            >
                              <span className="mr-2">
                                {batch.name} - {batch.expiryDate} - SL:{' '}
                                {quantity}
                              </span>{' '}
                            </div>
                          )}
                        </>
                      )
                    )}
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
          <div className="text-black-main">
            {importProductDetail?.data?.products?.length}
          </div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng cộng:</div>
          <div className="text-black-main">
            {formatMoney(importProductDetail?.data?.inbound?.totalPrice)}
          </div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá:</div>
          <div className="text-black-main">
            {formatMoney(importProductDetail?.data?.inbound?.discount)}
          </div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tiền đã trả NCC:</div>
          <div className="text-black-main">
            {formatMoney(importProductDetail?.data?.inbound?.paid)}
          </div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Nợ:</div>
          <div className="text-black-main">
            {formatMoney(importProductDetail?.data?.inbound?.debt)}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={BarcodeBlueIcon} alt="" />}
        >
          In mã vạch
        </CustomButton>
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={OpenOrderIcon} alt="" />}
        >
          Mở phiếu
        </CustomButton>
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={PrintOrderIcon} alt="" />}
        >
          In phiếu
        </CustomButton>
        <CustomButton
          outline={true}
          prefixIcon={<Image src={CloseIcon} alt="" />}
        >
          Hủy bỏ
        </CustomButton>
        <CustomButton
          type="success"
          prefixIcon={<Image src={PlusIcon} alt="" />}
        >
          Trả hàng nhập
        </CustomButton>
      </div>
    </div>
  );
}
