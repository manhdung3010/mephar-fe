import type { ColumnsType } from "antd/es/table";

import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatDateTime } from "@/helpers";
import { EOrderMarketStatus, EOrderMarketStatusLabel } from "@/modules/markets/type";

interface IRecord {
  id: number;
  time: string;
  note: string;
  status: string;
}

export function SeriModal({ isOpen, onCancel, record }: { isOpen: boolean; onCancel: () => void; record: any }) {
  const columns: ColumnsType<IRecord> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã seri",
      dataIndex: "code",
      key: "code",
    },
  ];

  return (
    <CustomModal customFooter={true} title="Seri đã nhập" isOpen={isOpen} onCancel={onCancel} width={1100}>
      <div className="my-4 h-[1px] w-full bg-[#C7C9D9]"></div>
      <CustomTable columns={columns} dataSource={record} bordered pagination={false} />
    </CustomModal>
  );
}
