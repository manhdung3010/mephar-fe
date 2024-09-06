import type { ColumnsType } from "antd/es/table";

import CustomTable from "../../../../components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { getWareHouseCard } from "@/api/product.service";
import { formatDateTime, formatNumber } from "@/helpers";

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
  INBOUND_RETURN: 3,
  MOVE: 4,
  ADJUSTMENT: 5,
  MOVE_RECEIVE: 6,
  SALE_RETURN: 7,
  SALE_MARKET: 8,
};

export const warehouseStatusLable = {
  [warehouseStatus.INBOUND]: "Nhập hàng",
  [warehouseStatus.ORDER]: "Đặt hàng",
  [warehouseStatus.INBOUND_RETURN]: "Trả hàng nhập",
  [warehouseStatus.MOVE]: "Chuyển hàng",
  [warehouseStatus.ADJUSTMENT]: "Kiểm kho",
  [warehouseStatus.MOVE_RECEIVE]: "Nhận hàng",
  [warehouseStatus.SALE_RETURN]: "Trả hàng bán",
  [warehouseStatus.SALE_MARKET]: "Bán trên chợ",
};

const WareHouseCard = ({ productId, branchId }) => {
  const { data: warehouseCard, isLoading } = useQuery(
    ["WAREHOUSE_CARD", productId, 1, 50, branchId],
    () =>
      getWareHouseCard({ productId: productId, page: 1, limit: 50, branchId })
  );

  console.log(warehouseCard?.data?.items);

  const columns: ColumnsType<IRecord> = [
    {
      title: "Chứng từ",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Phương thức",
      dataIndex: "type",
      key: "type",
      render: (type) => warehouseStatusLable[type],
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDateTime(date),
    },
    {
      title: "Đối tác",
      dataIndex: "partner",
      key: "partner",
    },
    {
      title: "Số lượng",
      dataIndex: "changeQty",
      key: "changeQty",
      render: (changeQty, { type }) => formatNumber(changeQty),
    },
    {
      title: "Tồn cuối",
      dataIndex: "remainQty",
      key: "remainQty",
    },
  ];

  return (
    <CustomTable
      dataSource={warehouseCard?.data?.items}
      columns={columns}
      loading={isLoading}
    />
  );
};

export default WareHouseCard;
