import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import ExportIcon from "@/assets/exportIcon.svg";
import ImportIcon from "@/assets/importIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import {
  EReturnProductStatus,
  EReturnProductStatusLabel,
  EReturnTransactionStatus,
  EReturnTransactionStatusLabel,
} from "@/enums";

import ReturnDetail from "./row-detail";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import { getSaleReturn } from "@/api/order.service";
import { formatDateTime, formatMoney } from "@/helpers";
import CustomPagination from "@/components/CustomPagination";
import { getReturnExcel } from "@/api/export.service";

interface IRecord {
  key: number;
  id: string;
  seller: string;
  creator: {
    fullName: string;
  };
  date: string;
  customer: string;
  needReturnAmount: number;
  returnedAmount: number;
  status: EReturnProductStatus;
}

export function ReturnTransaction() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    from: undefined,
    to: undefined,
    userId: undefined,
    storeId: undefined,
    status: undefined,
    customerId: undefined,
  });

  const { data: saleReturn, isLoading } = useQuery(["SALE_RETURN", formFilter, branchId], () =>
    getSaleReturn({ ...formFilter, branchId }),
  );

  const columns: ColumnsType<IRecord> = [
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
      title: "Người bán",
      dataIndex: "seller",
      key: "seller",
      render: (_, { creator }) => <span>{creator.fullName}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDateTime(createdAt),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <span>{customer?.fullName}</span>,
    },
    {
      title: "Cần trả khách",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => formatMoney(totalPrice),
    },
    {
      title: "Đã trả khách",
      dataIndex: "paid",
      key: "paid",
      render: (paid) => formatMoney(paid),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EReturnProductStatus.SUCCEED
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {EReturnProductStatusLabel[status]}
        </div>
      ),
    },
  ];

  async function downloadExcel() {
    try {
      const response = await getReturnExcel({ branchId });

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "return_data.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  }

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push("/sales?isReturn=true")}
          type="success"
          prefixIcon={<Image src={ImportIcon} />}
        >
          Thêm phiếu trả hàng
        </CustomButton>
      </div>

      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={saleReturn?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ [record.key]: true });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => <ReturnDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={saleReturn?.data?.totalItem}
      />
    </div>
  );
}
