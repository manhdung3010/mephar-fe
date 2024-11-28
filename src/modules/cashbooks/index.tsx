import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import DolorIcon from "@/assets/dolarIcon.svg";
import ExportIcon from "@/assets/exportIcon.svg";
import PaymentIcon from "@/assets/paymentIcon.svg";
import ReceiptIcon from "@/assets/receiptIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";

import { AddCashbookModal } from "./AddCashbookModal";
import RowDetail from "./row-detail";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getTransaction } from "@/api/cashbook.service";
import { formatDateTime, formatMoney, hasPermission } from "@/helpers";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import CustomPagination from "@/components/CustomPagination";
import { RoleAction, RoleModel } from "../settings/role/role.enum";
import dayjs from "dayjs";
import useExportToExcel from "@/hooks/useExportExcel";

interface IRecord {
  key: number;
  id: string;
  date: string;
  type: string;
  receiveUser: string;
  value: number;
}

export function Cashbook() {
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [openAddCashbookModal, setOpenAddCashbookModal] = useState(false);
  const [cashbookType, setCashbookType] = useState<string>("");

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    "paymentDate[start]": dayjs().startOf("month").format("YYYY-MM-DD"),
    "paymentDate[end]": undefined,
    ballotType: undefined,
    typeId: undefined,
    userId: undefined,
  });

  const { data: transactions, isLoading } = useQuery(["TRANSACTION", JSON.stringify(formFilter), branchId], () =>
    getTransaction({ ...formFilter, branchId }),
  );
  const columns: any = [
    {
      title: "Mã phiếu",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => <span className="cursor-pointer text-[#0070F4]">{value}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Loại thu phí",
      dataIndex: "typeTransaction",
      key: "typeTransaction",
      render: (value) => value?.name,
    },
    {
      title: "Người nộp/nhận",
      dataIndex: "targetCustomer",
      key: "targetCustomer",
      render: (value, record) =>
        record?.targetCustomer?.fullName ||
        record?.targetSupplier?.name ||
        record?.targetOther?.name ||
        record?.targetUser?.fullName,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <span>
          {record?.ballotType === "income" ? "" : "-"}
          {formatMoney(value)}
        </span>
      ),
    },
  ];

  const transformedData = transactions?.data?.items.map((item) => ({
    code: item.code,
    createdAt: formatDateTime(item.createdAt), // Định dạng lại thời gian tạo
    typeTransaction: item.typeTransaction?.name, // Lấy tên loại thu phí
    targetCustomer:
      item.targetCustomer?.fullName || item.targetSupplier?.name || item.targetOther?.name || item.targetUser?.fullName, // Lấy tên người nộp/nhận
    value: item.ballotType === "income" ? formatMoney(item.value) : `-${formatMoney(item.value)}`, // Định dạng lại giá trị
  }));

  const columnMapping = {
    code: "Mã phiếu",
    createdAt: "Thời gian",
    typeTransaction: "Loại thu phí",
    targetCustomer: "Người nộp/nhận",
    value: "Giá trị",
  };

  const { exported, exportToExcel } = useExportToExcel(transformedData, columnMapping, `SOQUY_${Date.now()}.xlsx`);

  return (
    <div className="mb-2">
      <div className="my-3 flex justify-end bg-white p-2">
        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#0070F4] ">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Quỹ đầu kỳ</div>
            <div className="text-[22px] text-[#0070F4]">{formatMoney(transactions?.data?.totalBefore)}</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#00B63E]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tổng thu</div>
            <div className="text-[22px] text-[#00B63E]">{formatMoney(transactions?.data?.totalIncome)}</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F32B2B]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tổng chi</div>
            <div className="text-[22px] text-[#F32B2B]">{formatMoney(transactions?.data?.totalExpenses)}</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tồn quỹ</div>
            <div className="text-[22px] text-[#FF8800]">
              {formatMoney(transactions?.data?.totalIncome - transactions?.data?.totalExpenses)}
            </div>
          </div>
        </div>
      </div>

      {hasPermission(profile?.role?.permissions, RoleModel.cashbook, RoleAction.create) && (
        <div className="mb-3 flex justify-end">
          <CustomButton
            type="success"
            prefixIcon={<Image src={ReceiptIcon} />}
            wrapClassName="mx-2"
            onClick={() => {
              setOpenAddCashbookModal(true);
              setCashbookType("income");
            }}
          >
            Lập phiếu thu
          </CustomButton>
          <CustomButton
            type="success"
            prefixIcon={<Image src={PaymentIcon} />}
            wrapClassName="mx-2"
            onClick={() => {
              setOpenAddCashbookModal(true);
              setCashbookType("expenses");
            }}
          >
            Lập phiếu chi
          </CustomButton>
          <CustomButton prefixIcon={<Image src={ExportIcon} />} wrapClassName="mx-2" onClick={exportToExcel}>
            Xuất file
          </CustomButton>
        </div>
      )}
      <Search setFormFilter={setFormFilter} formFilter={formFilter} />
      <CustomTable
        dataSource={transactions?.data?.items.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
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
          expandedRowRender: (record: IRecord) => <RowDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={transactions?.data?.totalItem}
      />

      <AddCashbookModal
        isOpen={openAddCashbookModal}
        onCancel={() => setOpenAddCashbookModal(false)}
        type={cashbookType}
      />
    </div>
  );
}
