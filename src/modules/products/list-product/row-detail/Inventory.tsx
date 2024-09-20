import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';

import { EProductStatus, EProductStatusLabel } from '@/enums';

import CustomTable from '../../../../components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { getProductInventory } from '@/api/product.service';
import { formatNumber } from '@/helpers';
import { useEffect, useState } from 'react';

interface IRecord {
  key: number;
  branch: {
    id: number;
    name: string;
  };
  inventory: number;
  order: number;
  planSoldOff: string;
  status: EProductStatus;
}

const Inventory = ({ productId, branchId, record }: { productId: number, branchId: number, record: any }) => {
  const [inventory, setInventory] = useState([]);
  const { data: productInventory, isLoading } = useQuery(
    [
      'PRODUCT_INVENTORY', productId, branchId
    ],
    () => getProductInventory(productId, { branchId }),
    {
      enabled: !!productId,
    }
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
      render: (_, { branch }) => branch?.name,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: 'Khách đặt hàng',
      dataIndex: 'customerOrders',
      key: 'customerOrders',
      render: (order) => formatNumber(order),
    },
    {
      title: 'Dự kiến hết hàng',
      dataIndex: 'stockout',
      key: 'stockout',
      render: (stockout) => formatNumber(stockout) + ' ngày',
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (_, { status }) => (
    //     <div
    //       className={cx(
    //         status === EProductStatus.active
    //           ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
    //           : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
    //         'px-2 py-1 rounded-2xl w-max'
    //       )}
    //     >
    //       {EProductStatusLabel[status]}
    //     </div>
    //   ),
    // },
  ];

  return <CustomTable dataSource={productInventory?.data} columns={columns} loading={isLoading} />;
};

export default Inventory;
