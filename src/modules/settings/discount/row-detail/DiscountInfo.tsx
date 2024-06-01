import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';
import { formatMoney, formatNumber } from '@/helpers';
import { ISaleProduct } from '@/modules/sales/interface';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import { getSaleProducts } from '@/api/product.service';

interface IRecord {
  key: number;
  totalPrice: number;
  discount: number;
  discountType: string;
  productDiscount: any[];
}

export function DiscountInfo({ record }: any) {
  console.log("record", record)

  const branchId = useRecoilValue(branchState);
  const { data: products, isLoading: isLoadingProduct, isSuccess } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    [
      'LIST_PRODUCT_DISCOUNT',
      1,
      999,
      "",
      branchId,
    ],
    () => getSaleProducts({ page: 1, limit: 999, keyword: "", branchId }),
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tổng tiền hàng từ',
      dataIndex: 'orderFrom',
      key: 'orderFrom',
      className: 'max-w-[50%] w-1/2',
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: 'Giảm giá hóa đơn',
      dataIndex: 'discountValue',
      key: 'discountValue',
      className: 'max-w-[50%] w-1/2',
      render: (text, { discountType }) => (
        <span>
          {discountType === 'percent' ? text + '%' : formatMoney(text)}
        </span>
      ),
    },
  ];
  const columns2: ColumnsType<IRecord> = [
    {
      title: 'Tổng tiền hàng từ',
      dataIndex: 'orderFrom',
      key: 'orderFrom',
      className: 'max-w-[50%] w-1/2',
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: 'Hàng/Nhóm hàng tặng',
      dataIndex: 'orderFrom',
      key: 'orderFrom',
      className: 'max-w-[50%] w-1/2',
      render: (text, { productDiscount }) => <div className='flex gap-2 flex-wrap'>{
        // map item to product name from productDiscount
        productDiscount.map((item) => {
          const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
          return product;
        }).map((product, index) => (
          <span className='bg-[#f0f0f0] rounded px-2 py-1' key={index}>{product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}</span>
        ))

      }</div>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
      className: 'max-w-[50%] w-1/2',
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];
  const columns3: ColumnsType<IRecord> = [
    {
      title: 'Tổng tiền hàng từ',
      dataIndex: 'orderFrom',
      key: 'orderFrom',
      className: 'max-w-[50%] w-1/2',
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: 'Hàng/Nhóm hàng tặng',
      dataIndex: 'orderFrom',
      key: 'orderFrom',
      className: 'max-w-[50%] w-1/2',
      render: (text, { productDiscount }) => <div className='flex gap-2 flex-wrap'>{
        // map item to product name from productDiscount
        productDiscount.map((item) => {
          const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
          return product;
        }).map((product, index) => (
          <span className='bg-[#f0f0f0] rounded px-2 py-1' key={index}>{product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}</span>
        ))

      }</div>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
      className: 'max-w-[50%] w-1/2',
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];

  return <CustomTable
    dataSource={

      record?.discountItem
    }
    columns={
      record?.target === "order" && record?.type === "order_price"
        ? columns
        : record?.target === "order" && record?.type === "product_price"
          ? columns2
          : columns2

    }
    bordered
    loading={isLoadingProduct}
  />;
}
