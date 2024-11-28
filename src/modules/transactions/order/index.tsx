import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import ExportIcon from "@/assets/exportFileIcon.svg";
import ImportIcon from "@/assets/importFileIcon.svg";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import { branchState } from "@/recoil/state";
import { getMarketOrder } from "@/api/market.service";
import { EOrderMarketStatus, EOrderMarketStatusLabel } from "@/modules/markets/type";
import OrderDetail from "./row-detail";
import Search from "./Search";
import { IOrder } from "./type";
import { useRouter } from "next/router";
import { CustomButton } from "@/components/CustomButton";
import PlusIcon from "@/assets/plusWhiteIcon.svg";

export function OrderTransaction() {
  const router = useRouter();
  const { keyword } = router.query;
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<IOrder[]>([]);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    type: "sell",
    dateNumber: 90,
  });

  const { data: orders, isLoading } = useQuery(["MAKET_ORDER", formFilter], () => getMarketOrder({ ...formFilter }));

  useEffect(() => {
    if (keyword) {
      setFormFilter((prevValue) => ({
        ...prevValue,
        keyword: keyword as string,
      }));
      const expandedRowKeysClone = { ...expandedRowKeys };
      orders?.data?.items?.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
      // filterData(keyword as string);
    } else {
      setExpandedRowKeys({});
    }
  }, [keyword]);

  const filterData = (keyword: string) => {
    if (!keyword) {
      setFilteredData([]);
      return;
    }
    const searchKeyword = keyword.toLowerCase().trim();

    const filtered = orders?.data?.items?.filter((item: IOrder) => {
      const productCode = item.code.toLowerCase();
      const productUserFullName = item?.customer.fullName.toLowerCase();
      const productName = item.products?.map((product) => product.product.name.toLowerCase()).join(", ");

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
    if (!formFilter.keyword?.trim()) {
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
      dataIndex: "products",
      key: "products",
      render: (products) => products?.length,
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value, record) => <span className="text-red-main font-medium">{formatMoney(value)}</span>,
    },
    {
      title: "Người mua",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName, record) => record?.store?.name,
    },
    // {
    //   title: "ĐVVC",
    //   dataIndex: "delivery",
    //   key: "delivery",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={`py-1 px-2 rounded-2xl border-[1px]  w-max
          ${status === EOrderMarketStatus.PENDING && " bg-[#fff2eb] border-[#FF8800] text-[#FF8800]"}
          ${
            status === EOrderMarketStatus.CONFIRM ||
            status === EOrderMarketStatus.PROCESSING ||
            (status === EOrderMarketStatus.SEND && " bg-[#e5f0ff] border-[#0063F7] text-[#0063F7]")
          }
          ${status === EOrderMarketStatus.DONE && " bg-[#e3fff1] border-[#05A660] text-[#05A660]"}
          ${
            status === EOrderMarketStatus.CANCEL ||
            (status === EOrderMarketStatus.CLOSED && " bg-[#ffe5e5] border-[#FF3B3B] text-[#FF3B3B]")
          }
          `}
        >
          {EOrderMarketStatusLabel[status?.toUpperCase()]}
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
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Lý do hủy",
      dataIndex: "closedNote",
      key: "closedNote",
      render: (value, record: any) => <p>{value || record?.cancelNote}</p>,
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

        <CustomButton
          onClick={() => router.push("/transactions/order/add-order")}
          type="success"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Tạo đơn hàng
        </CustomButton>
      </div>

      <div className="mb-2 bg-white">
        <div className="flex items-center border-b border-[#C7C9D9] p-5">
          <span className="mr-6 font-bold text-[#15171A]">ĐƠN HÀNG CẦN XỬ LÝ</span>
          <Select
            bordered={false}
            defaultValue={formFilter.dateNumber}
            className="min-w-[150px] text-red-main"
            options={[
              { label: "90 ngày gần nhất", value: 90 },
              { label: "60 ngày gần nhất", value: 60 },
              { label: "30 ngày gần nhất", value: 30 },
            ]}
            onChange={(value) => setFormFilter({ ...formFilter, dateNumber: value })}
            suffixIcon={<Image src={ArrowDownIcon} />}
          />
        </div>

        <div className="flex justify-between p-4 w-full overflow-x-auto">
          <div>
            <div className="mb-2 text-[#15171A]">
              Chờ xác nhận
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[0]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[0]?.sum)}
            </div>
          </div>
          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />
          <div>
            <div className="mb-2 text-[#15171A]">
              Đã xác nhận
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[1]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[1]?.sum)}
            </div>
          </div>
          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />
          <div>
            <div className="mb-2 text-[#15171A]">
              Đang xử lý
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[2]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[2]?.sum)}
            </div>
          </div>
          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />
          <div>
            <div className="mb-2 text-[#15171A]">
              Đã giao cho ĐVVC
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[3]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[3]?.sum)}
            </div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Hoàn thành
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[6]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[6]?.sum)}
            </div>
          </div>

          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Giao hàng thất bại
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[5]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[5]?.sum)}
            </div>
          </div>
          <div className="mx-6 w-[1px] border-l border-dashed border-[#ABABAB]" />

          <div>
            <div className="mb-2 text-[#15171A]">
              Đã hủy
              <span className="ml-1 rounded-[10px] bg-[#FBECEE] px-[6px] py-1 text-red-main">
                {formatNumber(orders?.data?.filterOrderByStatus[4]?.count)}
              </span>
            </div>
            <div className="text-xl font-medium text-[#182537]">
              {formatMoney(orders?.data?.filterOrderByStatus[4]?.sum)}
            </div>
          </div>
        </div>
      </div>

      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={(filteredData.length > 0 ? filteredData : orders?.data?.items)?.map((item, index) => ({
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
                const { [record.key - 1]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({
                  [record.key - 1]: true,
                });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IOrder) => <OrderDetail record={record} />,
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
