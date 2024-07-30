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

const ProductExpire = ({
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
          quantity: item.quantity,
          inventory: item.quantity,
          productUnit,
        };
      });
      setData(newData);
    }
  }, [productExpired?.data?.items]);

  const handleOnChange = (value, recordId) => {
    const newData = data.map((item) => {
      // change quantity to new unit
      if (
        item.productUnit.find((unit) => unit.id === value) &&
        item.id === recordId
      ) {
        const newQuantity =
          item.quantity /
          item.productUnit.find((unit) => unit.id === value).exchangeValue;
        return {
          ...item,
          unitId: value,
          inventory: Math.floor(newQuantity),
        };
      }
      return item;
    });
    // console.log("newData", newData)
    setData(newData);
  };

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
      dataIndex: "inventory",
      key: "inventory",
      render: (quantity) => formatNumber(quantity),
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: "Đơn vị",
      dataIndex: "productUnit",
      key: "productUnit",
      render: (productUnit, record: any) => (
        <CustomUnitSelect
          value={record?.unitId}
          onChange={(value) => handleOnChange(value, record?.id)}
          options={productUnit.map((unit) => {
            return {
              label: unit.unitName,
              value: unit.id,
            };
          })}
        />
      ),
    },
    // {
    //   title: 'Giá nhập gần nhất',
    //   dataIndex: 'lastInputPrice',
    //   key: 'lastInputPrice',
    // },
  ];

  return (
    <CustomTable dataSource={data} columns={columns} loading={isLoading} />
  );
};

export default ProductExpire;
