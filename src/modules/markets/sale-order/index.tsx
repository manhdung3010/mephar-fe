import { getMarketOrder } from "@/api/market.service";
import CustomTable from "@/components/CustomTable";
import { formatDateTime, formatMoney } from "@/helpers";
import { branchState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { useRecoilValue } from "recoil";
import GHNLogo from "@/assets/giaohangnhanh.svg";
import Image from "next/image";
import { EOrderMarketStatus, EOrderMarketStatusLabel } from "../type";
import CustomPagination from "@/components/CustomPagination";
import { useState } from "react";
import { useRouter } from "next/router";

function SaleOrder() {
  const branchId = useRecoilValue(branchState);
  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    type: "sell",
  });

  const { data: saleOrder, isLoading } = useQuery(["SALE_ORDER", JSON.stringify(formFilter)], () =>
    getMarketOrder(formFilter),
  );

  const columns: ColumnsType<any> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (value, record, index) => (
        <span
          className=" text-[#0070F4] cursor-pointer"
          onClick={() => {
            router.push(`/markets/sale-order/${record?.id}`);
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Ngày đặt mua",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDateTime(data),
    },
    {
      title: "Người mua",
      dataIndex: "branch",
      key: "branch",
      render: (_, record) => <span>{record?.store?.name ?? "" + " - " + record?.name}</span>,
    },
    {
      title: "Đơn vị vận chuyển",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => <Image src={GHNLogo} />,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, record) => <span className="text-red-main font-medium">{formatMoney(record?.totalPrice)}</span>,
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`py-1 px-2 rounded-[5px] border-[1px] 
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
          {EOrderMarketStatusLabel[status.toUpperCase()]}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="fluid-container">
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className="!text-red-main">
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Đơn hàng bán
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-6">
          <CustomTable dataSource={saleOrder?.data?.items} columns={columns} loading={isLoading} />

          <CustomPagination
            page={formFilter.page}
            pageSize={formFilter.limit}
            setPage={(value) => setFormFilter({ ...formFilter, page: value })}
            setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
            total={saleOrder?.data?.totalItem}
          />
        </div>
      </div>
    </div>
  );
}

export default SaleOrder;
