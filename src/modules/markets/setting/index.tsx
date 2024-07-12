import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import ExportIcon from "@/assets/exportIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EProductSettingStatus, EProductSettingStatusLabel } from "@/enums";

import BillDetail from "./row-detail";
import Search from "./Search";

interface IRecord {
  key: number;
  name: string;
  groupProduct: string;
  marketType: string;
  inventoryQuantity: number;
  soldQuantity: number;
  status: EProductSettingStatus;
  createdAt: string;
  updatedAt: string;
}

export function MarketSetting() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    name: "Panactol",
    groupProduct: "Nhóm 1",
    marketType: "Loại chợ",
    inventoryQuantity: 100,
    soldQuantity: 50,
    status: EProductSettingStatus.SELLING,
    createdAt: "09:10, 1212/2023",
    updatedAt: "09:10, 1212/2023",
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
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
      title: "Nhóm sản phẩm",
      dataIndex: "groupProduct",
      key: "groupProduct",
    },
    {
      title: "Loại chợ",
      dataIndex: "marketType",
      key: "marketType",
    },
    {
      title: "SL tồn",
      dataIndex: "inventoryQuantity",
      key: "inventoryQuantity",
    },
    {
      title: "SL đã bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EProductSettingStatus.SELLING
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EProductSettingStatusLabel[status]}
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (
        <div>
          <div>{value}</div>
          <div className="font-medium text-[#222325]">Nv: Quyentt</div>
        </div>
      ),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => (
        <div>
          <div>{value}</div>
          <div className="font-medium text-[#222325]">Nv: Quyentt</div>
        </div>
      ),
    },
  ];
  return (
    // <div>
    //   <div className="my-3 flex justify-end gap-4">
    //     <CustomButton
    //       onClick={() => router.push('/markets/setting/add-setting')}
    //       type="success"
    //       prefixIcon={<Image src={PlusIcon} />}
    //     >
    //       Thêm mới
    //     </CustomButton>

    //     <CustomButton prefixIcon={<Image src={ExportIcon} />}>
    //       Xuất file
    //     </CustomButton>
    //   </div>

    //   <Search />

    //   <CustomTable
    //     rowSelection={{
    //       type: 'checkbox',
    //     }}
    //     dataSource={dataSource}
    //     columns={columns}
    //     expandable={{
    //       // eslint-disable-next-line @typescript-eslint/no-shadow
    //       expandedRowRender: (record: IRecord) => (
    //         <BillDetail record={record} />
    //       ),
    //       expandIcon: () => <></>,
    //       expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
    //     }}
    //   />
    // </div>
    <div className="py-5">Đang cập nhật...</div>
  );
}
