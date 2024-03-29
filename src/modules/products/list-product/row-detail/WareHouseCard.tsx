import type { ColumnsType } from 'antd/es/table';

import CustomTable from '../../../../components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { getWareHouseCard } from '@/api/product.service';
import { formatDateTime, formatNumber } from '@/helpers';

interface IRecord {
  key: number;
  code: string;
  method: string;
  time: string;
  partner: string;
  cost: string;
  quantity: string;
  inStock: string;
  type?: number;
}

export const warehouseStatus = {
  INBOUND: 1,
  ORDER: 2,
};

const warehouseStatusLable = {
  [warehouseStatus.INBOUND]: 'Nhập hàng',
  [warehouseStatus.ORDER]: 'Đặt hàng',
}

const WareHouseCard = ({ productId, branchId }) => {
  const { data: warehouseCard, isLoading } = useQuery(
    [
      'WAREHOUSE_CARD',
      productId,
      1,
      50,
      branchId
    ],
    () => getWareHouseCard({ productId: productId, page: 1, limit: 50, branchId })
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Chứng từ',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Phương thức',
      dataIndex: 'type',
      key: 'type',
      render: (type) => warehouseStatusLable[type],
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDateTime(date),
    },
    {
      title: 'Đối tác',
      dataIndex: 'partner',
      key: 'partner',
    },
    {
      title: 'Số lượng',
      dataIndex: 'changeQty',
      key: 'changeQty',
      render: (changeQty, record) => record?.type === warehouseStatus.INBOUND ? formatNumber(changeQty) : `-${formatNumber(changeQty)}`,
    },
    {
      title: 'Tồn cuối',
      dataIndex: 'remainQty',
      key: 'remainQty',
    },
  ];

  return <CustomTable dataSource={warehouseCard?.data?.items} columns={columns} loading={isLoading} />;
};

export default WareHouseCard;
