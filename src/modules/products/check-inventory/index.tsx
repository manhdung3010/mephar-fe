import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ExportIcon from '@/assets/exportIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import ProductDetail from './row-detail';
import Search from './Search';
import { useQuery } from '@tanstack/react-query';
import { getInventoryChecking } from '@/api/check-inventory';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import { formatMoney, formatNumber } from '@/helpers';

interface IRecord {
  key: number;
  id: string;
  date: string;
  balanceDate: string;
  actualAmount: number;
  diffTotal: number;
  diffGreat: number;
  diffLess: number;
  note: string;
}

export function CheckInventory() {
  const router = useRouter();
  const [inventoryList, setInventoryList] = useState<any[]>([]);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const branchId = useRecoilValue(branchState);

  const [inventoryFormFilter, setInventoryFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId,
  });

  const { data: inventoryCheckingList, isLoading } = useQuery(
    ["INVENTORY_CHECKING", inventoryFormFilter.page, inventoryFormFilter.limit, inventoryFormFilter.keyword, inventoryFormFilter.branchId],
    () => getInventoryChecking(inventoryFormFilter),
  );

  useEffect(() => {
    if (inventoryCheckingList) {
      const newInventoryList = inventoryCheckingList?.data?.items?.map(
        (item, index) => {
          const totalRealQuantity = item?.inventoryCheckingProduct.reduce(
            (acc, curr) => acc + curr.realQuantity,
            0
          )
          const newProduct = item?.inventoryCheckingProduct.map((product, index) => ({
            ...product,
            totalPrice: product.realQuantity * product.productUnit?.price,
          }));
          const totalVal = newProduct.reduce((acc, curr) => acc + curr.totalPrice, 0);
          return {
            ...item,
            totalRealQuantity: totalRealQuantity,
            inventoryCheckingProduct: newProduct,
            totalVal: totalVal,
            key: index + 1,
          }
        }
      );
      console.log("newInventoryList", newInventoryList)
      setInventoryList(newInventoryList);
    }
  }, [inventoryCheckingList]);

  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã kiểm kho',
      dataIndex: 'code',
      key: 'code',
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
        // onClick={() => {
        //   const currentState = expandedRowKeys[`${index}`];
        //   const temp = { ...expandedRowKeys };
        //   if (currentState) {
        //     delete temp[`${index}`];
        //   } else {
        //     temp[`${index}`] = true;
        //   }
        //   setExpandedRowKeys({ ...temp });
        // }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Ngày cân bằng',
      dataIndex: 'balanceDate',
      key: 'balanceDate',
    },
    {
      title: 'SL thực tế',
      dataIndex: 'totalRealQuantity',
      key: 'totalRealQuantity',
      render: (value) => <span>{formatNumber(value)}</span>,
    },
    {
      title: 'Tổng thực tế',
      dataIndex: 'totalVal',
      key: 'totalVal',
      render: (value) => <span>{formatMoney(value)}</span>,
    },
    {
      title: 'Tổng chênh lệch',
      dataIndex: 'diffTotal',
      key: 'diffTotal',
    },
    {
      title: 'SL lệch tăng',
      dataIndex: 'diffGreat',
      key: 'diffGreat',
    },
    {
      title: 'SL lệch giảm',
      dataIndex: 'diffLess',
      key: 'diffLess',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push('/products/check-inventory/coupon')}
          type="success"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Kiểm kho
        </CustomButton>
        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>
      <Search />
      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={inventoryList}
        columns={columns}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ ...expandedRowKeys, [record.key]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => (
            <ProductDetail record={record} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
    </div>
  );
}
