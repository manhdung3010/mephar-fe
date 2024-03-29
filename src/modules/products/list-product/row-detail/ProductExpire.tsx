import type { ColumnsType } from 'antd/es/table';

import CustomTable from '../../../../components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { getProductExpired } from '@/api/product.service';
import { formatDate, formatNumber } from '@/helpers';

interface IRecord {
  key: number;
  product: string;
  expireDate: string;
  quantity: number;
  lastInputPrice: number;
}

const ProductExpire = ({ productId, branchId }: { productId: number, branchId: number }) => {
  const record = {
    key: 1,
    product: 'Sản phẩm A',
    expireDate: '2023-11-08',
    quantity: 10,
    lastInputPrice: 10000,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const { data: productExpired, isLoading } = useQuery(
    [
      'PRODUCT_EXPIRED',
      productId,
      1,
      50,
      branchId
    ],
    () => getProductExpired({ productId: productId, page: 1, limit: 50, branchId })
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Lô/hạn sử dụng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (expiryDate) => formatDate(expiryDate),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => formatNumber(quantity),
    },
    // {
    //   title: 'Giá nhập gần nhất',
    //   dataIndex: 'lastInputPrice',
    //   key: 'lastInputPrice',
    // },
  ];

  return <CustomTable dataSource={productExpired?.data?.items} columns={columns} loading={isLoading} />;
};

export default ProductExpire;
