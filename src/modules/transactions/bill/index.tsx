import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import PlusIconWhite from '@/assets/PlusIconWhite.svg';

import { getOrder } from "@/api/order.service";
import ExportIcon from "@/assets/exportIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { EOrderStatus, EOrderStatusLabel } from "@/enums";
import { formatMoney, formatNumber } from "@/helpers";
import { branchState } from "@/recoil/state";


import BillDetail from "./row-detail";
import Search from "./Search";
import { IOrder } from "../order/type";

export function BillTransaction() {
  const branchId = useRecoilValue(branchState);

  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    status: EOrderStatus.SUCCEED,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ["ORDER_LIST", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getOrder(formFilter)
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
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
      title: "Mã trả hàng",
      dataIndex: "returnId",
      key: "returnId",
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
      render: (value) => formatMoney(value),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (_, { discount, discountType }) =>
        discount ? `${formatNumber(discount)}${discountType}` : 0,
    },
    {
      title: "Khách đã trả",
      dataIndex: "cashOfCustomer",
      key: "cashOfCustomer",
      render: (value) => formatMoney(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EOrderStatus.SUCCEED
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EOrderStatusLabel[status]}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push("/sales/")}
          type="success"
          prefixIcon={<Image src={PlusIconWhite} />}
        >
          Thêm hóa đơn
        </CustomButton>

        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>

      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />

      <CustomTable
        rowSelection={{
          type: "checkbox",
        }}
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
    </div>
  );
}
