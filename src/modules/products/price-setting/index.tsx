import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getPriceSetting } from "@/api/price-setting.service";
import EditIcon from "@/assets/editIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { formatMoney, hasPermission } from "@/helpers";

import { EditPriceModal } from "./EditPriceModal";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import Search from "./Search";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

interface IRecord {
  key: number;
  id: number;
  exchangeValue: number;
  price: number;
  code: number;
  product: {
    id: number;
    code: string;
    name: string;
    productUnit: { name: string }[];
    inventory: number;
    primePrice: number;
    price: number;
  };
  unitName: string;
  marketPrice: number;
  posPrice: number;
}

export function PriceSetting() {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [selectedBatchId, setSelectedBatchId] = useState<number>();
  const [filteredData, setFilteredData] = useState<IRecord[]>([]);

  const { data: priceSettings, isLoading } = useQuery(
    [
      "LIST_PRICE_SETTING",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId
    ],
    () => getPriceSetting({ ...formFilter, branchId })
  );

  useEffect(() => {
    if (!formFilter.keyword.trim()) {
      setFilteredData([]);
    }
  }, [formFilter.keyword]);

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",

    },
    {
      title: "Tên hàng",
      dataIndex: "product",
      key: "product",
      render: (value) => (
        <span className="cursor-pointer text-[#0070F4]">{value.name}</span>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "Giá vốn",
      dataIndex: "product",
      key: "product",
      render: (product, { exchangeValue }) =>
        formatMoney(product.primePrice * exchangeValue),
    },
    {
      title: "Giá nhập cuối",
      dataIndex: "price",
      key: "price",
      render: (value) => formatMoney(value),
    },
    // {
    //   title: "Giá bán trên chợ",
    //   dataIndex: "marketPrice",
    //   key: "marketPrice",
    //   render: (value) => (
    //     <CustomInput
    //       bordered={false}
    //       suffixIcon={<Image src={EditIcon} />}
    //       className="w-[120px]"
    //       onChange={() => { }}
    //       type="number"
    //     />
    //   ),
    // },
    {
      title: "Giá bán POS",
      dataIndex: "price",
      key: "price",
      render: (value, { id }) => (
        <CustomInput
          bordered={false}
          suffixIcon={hasPermission(profile?.role?.permissions, RoleModel.price_setting, RoleAction.update) ? <Image src={EditIcon} className="cursor-pointer" onClick={() => setSelectedBatchId(id)} /> : null}
          className="w-[120px]"
          onChange={() => { }}
          type="number"
          defaultValue={value}

        />
      ),
    },
  ];

  return (
    <div className="my-6 bg-white">
      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={(filteredData.length > 0
          ? filteredData
          : priceSettings?.data?.items
        )?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={priceSettings?.data?.totalItem}
      />

      <EditPriceModal
        isOpen={!!selectedBatchId}
        onCancel={() => setSelectedBatchId(undefined)}
        batchId={selectedBatchId}
        productName={
          priceSettings?.data?.items?.find(
            (item) => item.id === selectedBatchId
          )?.product?.name
        }
        price={
          priceSettings?.data?.items?.find(
            (item) => item.id === selectedBatchId
          )?.price
        }
        key={selectedBatchId}
      />
    </div>
  );
}
