import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ExportIcon from "@/assets/exportIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";

import ProductDetail from "./row-detail";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getInventoryChecking } from "@/api/check-inventory";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { formatDateTime, formatMoney, formatNumber, hasPermission } from "@/helpers";
import CustomPagination from "@/components/CustomPagination";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { debounce } from "lodash";
import { getProductDetail } from "@/api/product.service";

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
  const profile = useRecoilValue(profileState);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [selectIdProduct, setIdProduct] = useState();

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
  const branchId = useRecoilValue(branchState);

  const [inventoryFormFilter, setInventoryFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    userCreateId: undefined,
    branchId,
  });

  const { data: inventoryCheckingList, isLoading } = useQuery(["INVENTORY_CHECKING", inventoryFormFilter], () =>
    getInventoryChecking(inventoryFormFilter),
  );

  const { data: productDetail } = useQuery(
    ["DETAIL_PRODUCT", selectIdProduct],
    () => getProductDetail(Number(selectIdProduct)),
    { enabled: !!selectIdProduct },
  );

  console.log(productDetail);

  useEffect(() => {
    if (inventoryCheckingList) {
      const newInventoryList = inventoryCheckingList?.data?.items?.map((item, index) => {
        const totalRealQuantity = item?.inventoryCheckingProduct.reduce((acc, curr) => acc + curr.realQuantity, 0);
        let increaseTotal = 0;
        let decreaseTotal = 0;
        let increaseVal = 0;
        let decreaseVal = 0;
        item?.inventoryCheckingProduct.forEach((product) => {
          if (product.difference > 0) {
            increaseTotal += product.difference;
            increaseVal += product.difference * product.productUnit?.price;
          } else {
            decreaseTotal += product.difference;
            decreaseVal += product.difference * product.productUnit?.price;
          }
        });
        const newProduct = item?.inventoryCheckingProduct.map((product, index) => ({
          ...product,
          totalPrice: product.realQuantity * product.productUnit?.price,
        }));
        const totalVal = newProduct.reduce((acc, curr) => acc + curr.totalPrice, 0);
        return {
          ...item,
          totalRealQuantity,
          inventoryCheckingProduct: newProduct,
          totalVal,
          totalIncrease: increaseTotal,
          increaseVal,
          decreaseVal,
          totalDecrease: decreaseTotal,
          key: index + 1,
        };
      });
      setInventoryList(newInventoryList);
    }
  }, [inventoryCheckingList]);

  const columns: any = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã kiểm kho",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => <span className="cursor-pointer text-[#0070F4]">{value}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>{formatDateTime(value)}</span>,
    },
    {
      title: "Ngày cân bằng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>{formatDateTime(value)}</span>,
    },
    {
      title: "SL thực tế",
      dataIndex: "totalRealQuantity",
      key: "totalRealQuantity",
      render: (value) => <span>{formatNumber(value)}</span>,
    },
    {
      title: "Tổng thực tế",
      dataIndex: "totalVal",
      key: "totalVal",
      render: (value) => <span>{formatMoney(value)}</span>,
    },
    {
      title: "Tổng chênh lệch",
      dataIndex: "diffTotal",
      key: "diffTotal",
      render: (value, record) => <span>{formatNumber(record?.totalIncrease + record?.totalDecrease)}</span>,
    },
    {
      title: "SL lệch tăng",
      dataIndex: "totalIncrease",
      key: "totalIncrease",
    },
    {
      title: "SL lệch giảm",
      dataIndex: "totalDecrease",
      key: "totalDecrease",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.check_inventory, RoleAction.create) && (
          <CustomButton
            onClick={() => router.push("/products/check-inventory/coupon")}
            type="success"
            prefixIcon={<Image src={PlusIcon} />}
          >
            Kiểm kho
          </CustomButton>
        )}

        <CustomButton prefixIcon={<Image src={ExportIcon} />}>Xuất file</CustomButton>
      </div>
      <Search
        onChange={debounce((value) => {
          console.log("value", value);
          setInventoryFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            "createdAt[start]": value?.createdAt1,
            "createdAt[end]": value?.createdAt2,
            userCreateId: value?.userCreateId,
          }));
        }, 300)}
      />
      <CustomTable
        dataSource={inventoryList}
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
          expandedRowRender: (record: IRecord) => {
            // <ProductDetail record={record} />
            console.log(record);

            return <h1>asd</h1>;
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
        loading={isLoading}
      />

      <CustomPagination
        page={inventoryFormFilter.page}
        pageSize={inventoryFormFilter.limit}
        setPage={(value) => setInventoryFormFilter({ ...inventoryFormFilter, page: value })}
        setPerPage={(value) => setInventoryFormFilter({ ...inventoryFormFilter, limit: value })}
        total={inventoryCheckingList?.data?.totalItem}
      />
    </div>
  );
}
