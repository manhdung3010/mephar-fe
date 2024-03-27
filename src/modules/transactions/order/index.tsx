import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { debounce } from "lodash";

import { getOrder } from "@/api/order.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import ExportIcon from "@/assets/exportFileIcon.svg";
import ImportIcon from "@/assets/importFileIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { EOrderStatus, EOrderStatusLabel } from "@/enums";
import { formatMoney } from "@/helpers";
import { branchState } from "@/recoil/state";

import OrderDetail from "./row-detail";
import { IOrder } from "./type";

export function OrderTransaction() {
  const branchId = useRecoilValue(branchState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const [filteredData, setFilteredData] = useState<IOrder[]>([]);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  const { data: orders, isLoading } = useQuery(
    ["ORDER_LIST", formFilter.keyword, branchId],
    () => getOrder({ ...formFilter, branchId })
  );

  const filterData = (keyword: string) => {
    if (!keyword) {
      setFilteredData([]);
      return;
    }
    const searchKeyword = keyword.toLowerCase().trim();

    const filtered = orders?.data?.items?.filter((item: IOrder) => {
      const productCode = item.code.toLowerCase();
      const productUserFullName = item.customer.fullName.toLowerCase();
      const productName = item.products
        ?.map((product) => product.product.name.toLowerCase())
        .join(", ");

      return (
        productName.includes(searchKeyword) ||
        productCode.includes(searchKeyword) ||
        productUserFullName.includes(searchKeyword)
      );
    });

    setFilteredData(filtered || []);
  };

  const handleSearch = debounce((value: string) => {
    setFormFilter((prevValue) => ({
      ...prevValue,
      keyword: value,
    }));
    filterData(value);
  }, 300);

  useEffect(() => {
    if (!formFilter.keyword.trim()) {
      setFilteredData([]);
    }
  }, [formFilter.keyword]);

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã đơn hàng",
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
      title: "Tổng số SP",
      dataIndex: "totalProducts",
      key: "totalProducts",
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "cashOfCustomer",
      key: "cashOfCustomer",
      render: (value) => formatMoney(value),
    },
    {
      title: "Doanh thu",
      dataIndex: "earnMoney",
      key: "earnMoney",
    },
    {
      title: "Người mua",
      dataIndex: "customer",
      key: "customer",
      render: (data) => data?.fullName,
    },
    {
      title: "ĐVVC",
      dataIndex: "delivery",
      key: "delivery",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            {
              "text-[#FF8800] border border-[#FF8800] bg-[#fff]":
                status === EOrderStatus.PENDING,
              "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]":
                status === EOrderStatus.SUCCEED,
              "text-[#0070F4] border border-[#0070F4] bg-[#E4F0FE]":
                status === EOrderStatus.DELIVERING,
              "text-[#EA2020] border border-[#EA2020] bg-[#FFE7E9]":
                status === EOrderStatus.CANCELLED,
            },
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EOrderStatusLabel[status]}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>Tạo: {value}</span>,
    },
    {
      title: "Lý do hủy",
      dataIndex: "note",
      key: "note",
    },
  ];
  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Image src={ExportIcon} /> Xuất file
        </div>

        <div className="h-5 w-[1px] bg-[#D3D5D7]"></div>

        <div className="flex items-center gap-2">
          <Image src={ImportIcon} /> Nhập hàng
        </div>

        <CustomButton type="success" prefixIcon={<Image src={PlusIcon} />}>
          Tạo đơn hàng
        </CustomButton>
      </div>

      <div className="mb-2 bg-white">
        <div className="flex items-center border-b border-[#C7C9D9] p-5">
          <span className="mr-6 font-bold text-[#15171A]">
            ĐƠN HÀNG CẦN XỬ LÝ
          </span>
          <Select
            bordered={false}
            defaultValue={"1"}
            className="min-w-[150px] text-red-main"
            options={[{ label: "90 ngày gần nhất", value: "1" }]}
            suffixIcon={<Image src={ArrowDownIcon} />}
          />
        </div>

        <div className="flex justify-between p-4">
          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ duyệt
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ thanh toán
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ đóng gói
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ lấy hàng
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ lấy hàng
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ giao lại
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                0
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">0</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <input
          className="w-full px-2 py-1 outline-none border rounded"
          placeholder="Tìm kiếm theo mã đơn hàng, người mua"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <CustomTable
        rowSelection={{
          type: "checkbox",
        }}
        dataSource={(filteredData.length > 0
          ? filteredData
          : orders?.data?.items
        )?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key - 1]) {
                const { [record.key - 1]: value, ...remainingKeys } =
                  expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({
                  ...expandedRowKeys,
                  [record.key - 1]: true,
                });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IOrder) => (
            <OrderDetail record={record} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={orders?.data?.totalItem}
      />
    </div>
  );
}
