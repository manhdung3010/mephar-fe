import type { ColumnsType } from "antd/es/table";

import { getProductExpired } from "@/api/product.service";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import { formatDate, formatNumber } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CustomTable from "../../../../components/CustomTable";

interface IRecord {
  key: number;
  product: string;
  expireDate: string;
  quantity: number;
  lastInputPrice: number;
}

const SystemLot = ({
  productId,
  branchId,
  productUnit,
}: {
  productId: number;
  branchId: number;
  productUnit: any[];
}) => {
  const { data: productExpired, isLoading } = useQuery(
    ["PRODUCT_EXPIRED", productId, 1, 50, branchId],
    () =>
      getProductExpired({ productId: productId, page: 1, limit: 50, branchId })
  );

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (productExpired?.data?.items) {
      const newData = productExpired.data.items.map((item, index) => {
        return {
          ...item,
          unitId: productUnit.find((item) => item.isBaseUnit)?.id,
          oldQuantity: item?.oldQuantity,
          quantity: item.quantity,
          inventory: item.quantity,
          productUnit,
        };
      });
      setData(newData);
    }
  }, [productExpired?.data?.items]);

  console.log(data);

  const columns: ColumnsType<IRecord> = [
    {
      title: "Lô",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (expiryDate) => formatDate(expiryDate),
    },
    {
      title: "Tồn",
      dataIndex: "oldQuantity",
      key: "oldQuantity",
      render: (oldQuantity) => formatNumber(oldQuantity),
    },
  ];

  const totalInventory = data?.reduce((sum, item) => sum + item.oldQuantity, 0);

  return (
    <>
      {" "}
      <CustomTable dataSource={data} columns={columns} loading={isLoading} />
      <div className="text-start">
        Tổng số lượng: <span className="font-bold">{totalInventory}</span>
      </div>
    </>
  );
};

export default SystemLot;
