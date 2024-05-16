import { getOrder } from '@/api/order.service';
import { CustomModal } from '@/components/CustomModal'
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { EOrderStatus, EOrderStatusLabel } from '@/enums';
import { formatMoney } from '@/helpers';
import { IOrder } from '@/modules/transactions/order/type';
import { branchState, profileState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import cx from "classnames";
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CustomButton } from '@/components/CustomButton';
import Search from './Search';
import BillDetail from './row-detail';

function Invoice({
  isOpen,
  onCancel,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave?: (value) => void;
}) {
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: '',
    dateRange: { startDate: undefined, endDate: undefined },
    status: undefined,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ['ORDER_LIST', JSON.stringify(formFilter), branchId, isOpen],
    () => getOrder({ ...formFilter, branchId }),
    {
      enabled: !!isOpen,
    }
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (data) => data?.fullName,
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, record) => {
        let total = 0;
        record.products?.forEach((item) => {
          total += item.price;
        });
        return formatMoney(total);
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (_, { discount, discountType }) => discountType === 1 ? `${discount}%` : formatMoney(discount),
    },
    {
      title: "Tổng tiền sau giảm giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatMoney(value),
    },
    {
      title: "Khách đã trả",
      dataIndex: "cashOfCustomer",
      key: "cashOfCustomer",
      render: (value) => formatMoney(value),
    },
  ];
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Danh sách đơn hàng"
      width={1114}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={orders?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key - 1]) {
                const { [record.key - 1]: value, ...remainingKeys } =
                  expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({
                  ...expandedRowKeys,
                  [record.key - 1]: true,
                });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IOrder) => <BillDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={orders?.data?.totalItem}
      />
    </CustomModal>
  )
}

export default Invoice