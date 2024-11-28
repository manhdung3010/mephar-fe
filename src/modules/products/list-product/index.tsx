import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { getProduct } from "@/api/product.service";
import CustomPagination from "@/components/CustomPagination";
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from "@/enums";
import { formatMoney, formatNumber, sliceString } from "@/helpers";
import { branchState } from "@/recoil/state";

import CustomTable from "../../../components/CustomTable";
import Header from "./Header";
import ListUnit from "./ListUnit";
import Search from "./Search";
import ProductDetail from "./row-detail";
import type { IProduct } from "./types";

const ProductList = () => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    type: null,
    status: null,
    inventoryType: null,
  });

  const [valueChange, setValueChange] = useState<number | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<IProduct[]>([]);

  const { data: products, isLoading } = useQuery(
    [
      "LIST_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
      formFilter.status,
      formFilter.type,
      formFilter.inventoryType,
    ],
    () => getProduct({ ...formFilter, branchId }),
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSelectedList(
      products?.data?.items
        ?.map((item) => ({
          ...item,
          unitId: item?.productUnit?.find((unit) => unit.isBaseUnit)?.id,
          unitQuantity: item?.inventory / item?.productUnit?.find((unit) => unit.isBaseUnit)?.exchangeValue,
          tempPrimePrice: item?.primePrice * item?.productUnit?.find((unit) => unit.isBaseUnit)?.exchangeValue,
        }))
        ?.sort(function (a, b) {
          return b.id - a.id;
        }),
    );
  }, [formFilter, products?.data?.items]);

  const columns: ColumnsType<IProduct> = [
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên hàng",
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
          {sliceString(value, 80)}
        </span>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "productUnit",
      key: "productUnit",
      className: "unit-col",
      render: (data, record) => {
        return (
          <ListUnit
            data={data}
            onChangeUnit={(value) => handleChangeUnitValue(value, record)}
            record={record}
            isDetailOpen={true}
          />
        );
      },
    },
    {
      title: "Nhóm hàng",
      dataIndex: "groupProduct",
      key: "groupProduct",
      render: (data) => data?.name,
    },
    {
      title: "Tồn kho",
      dataIndex: "unitQuantity",
      key: "unitQuantity",
      render: (data) => formatNumber(Math.floor(data)),
    },
    {
      title: "Loại hàng",
      dataIndex: "type",
      key: "type",
      render: (value) => EProductTypeLabel[getEnumKeyByValue(EProductType, value)],
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (value, record) => {
        return formatMoney(value);
      },
    },
    {
      title: "Giá vốn",
      dataIndex: "tempPrimePrice",
      key: "tempPrimePrice",
      render: (value) => formatMoney(value),
    },
  ];

  const handleChangeUnitValue = (value, record) => {
    setValueChange(value);
    const filter = selectedList.filter((item) => item?.id !== record.id);
    const newRecord = record?.productUnit?.find((unit) => unit.id === value);
    setSelectedList(
      [
        ...filter,
        {
          ...record,
          price: newRecord?.price,
          code: newRecord?.code,
          barCode: newRecord.barCode,
          unitId: value,
          unitQuantity: Number(record?.inventory) / newRecord?.exchangeValue,
          tempPrimePrice: record?.primePrice * newRecord?.exchangeValue,
        },
      ]?.sort(function (a, b) {
        return b.id - a.id;
      }),
    );
  };

  return (
    <div>
      <Header data={selectedList} />
      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            status: value?.status,
            type: value?.type,
            inventoryType: value?.inventoryType,
          }));
        }, 300)}
      />
      <CustomTable
        dataSource={selectedList?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Check if the click came from the action column
              if (
                (event.target as Element).closest(".ant-table-cell.unit-col") ||
                (event.target as Element).closest(".rc-virtual-list-holder-inner")
              ) {
                return;
              }
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
          expandedRowRender: (record: IProduct) => {
            return (
              <ProductDetail
                record={record}
                onChangeUnit={(value) => handleChangeUnitValue(value, record)}
                branchId={branchId}
              />
            );
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={products?.data?.totalItem}
      />
      {/* <div className="m-auto flex w-fit flex-col gap-14">
        <div className="m-auto w-[276px]">
          <Image src={EmptyImg} alt="" />
        </div>
        <div>
          <div className="text-center text-xl font-medium text-[#182537]">
            Cửa hàng của bạn chưa có sản phẩm nào
          </div>
          <div className="text-center text-base text-[#888888]">
            Thêm mới hoặc nhập danh sách sản phẩm của bạn
          </div>

          <div className="m-auto mt-6 grid w-[352px] grid-cols-2 gap-x-[30px] gap-y-6">
            <CustomButton
              color="red"
              variant="outline"
              prefixIcon={DownloadRedIcon}
              className="font-medium"
            >
              Nhập file
            </CustomButton>
            <AddNew />
            <div className="whitespace-pre-wrap text-center text-sm text-[#888888]">
              Sử dụng khi bạn muốn nhập một danh sách sản phẩm
            </div>
            <div className="whitespace-pre-wrap text-center text-sm text-[#888888]">
              Sử dụng khi bạn muốn tạo mới một sản phẩm
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductList;
