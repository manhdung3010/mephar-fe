import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";

import { getBranch } from "@/api/branch.service";
import { getSaleReport } from "@/api/report.service";
import CustomTable from "@/components/CustomTable";
import { ESaleReportConcerns, saleReportLabels } from "@/enums";
import { formatMoney, formatNumber } from "@/helpers";
import { branchGenegalState, branchState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Search from "./Search";
import RowDetail from "./row-detail";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { generalId } from "@/layouts/Header";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface IRecord {
  key: number;
  date: string;
  name: string;
  costPrice: number;
  discountPrice: number;
  earnPrice: number;
  totalCostPrice: number;
  grossPrice: number;
}

export function SaleReport() {
  const router = useRouter();
  const [branch] = useRecoilState(branchState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const [formFilter, setFormFilter] = useState({
    type: 1,
    concern: "TIME",
    // branchId: branch ? branch : undefined,
    from: dayjs().format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const { data: saleReport, isLoading } = useQuery(
    ["SALE_REPORT", formFilter.from, formFilter.to, formFilter.concern, branch],
    () =>
      getSaleReport({
        from: formFilter.from,
        to: formFilter.to,
        ...(String(branch) === generalId ? {} : { branchId: branch }),
        concern: formFilter.concern,
      }),
  );

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: true,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const columns: ColumnsType<IRecord> = [
    {
      title: "Thời gian",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Giá trị trả",
      dataIndex: "saleReturn",
      key: "saleReturn",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Doanh thu thuần",
      dataIndex: "realRevenue",
      key: "realRevenue",
      render: (value) => formatMoney(+value),
    },
  ];

  const revenueColumns: ColumnsType<IRecord> = [
    {
      title: "Thời gian",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Giảm giá",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Tổng giá vốn",
      dataIndex: "totalPrime",
      key: "totalPrime",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Lợi nhuận gộp",
      dataIndex: "profit",
      key: "profit",
      render: (value) => formatMoney(+value),
    },
  ];

  const discountColumns: ColumnsType<IRecord> = [
    {
      title: "Thời gian",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tổng hóa đơn",
      dataIndex: "totalOrder",
      key: "totalOrder",
      render: (value) => formatNumber(+value),
    },
    {
      title: "Giảm giá hóa đơn",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Giá trị hóa đơn",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatMoney(+value),
    },
  ];
  const employeeColumns: ColumnsType<IRecord> = [
    {
      title: "Người bán",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Giá trị trả",
      dataIndex: "saleReturn",
      key: "saleReturn",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Doanh thu thuần",
      dataIndex: "realRevenue",
      key: "realRevenue",
      render: (value) => formatMoney(+value),
    },
  ];

  const renderSummary = () => {
    switch (formFilter.concern) {
      case ESaleReportConcerns.TIME:
        return (
          <Table.Summary.Row className="bg-[#e6fff6] font-semibold text-base">
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              {formatMoney(saleReport?.data?.summary?.totalRevenue)}
            </Table.Summary.Cell>{" "}
            {/* Empty cell */}
            <Table.Summary.Cell index={2}>{formatMoney(saleReport?.data?.summary?.saleReturn)}</Table.Summary.Cell>
            <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.realRevenue)}</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      case ESaleReportConcerns.REVENUE:
        return (
          <Table.Summary.Row className="bg-[#e6fff6] font-semibold text-base">
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>{formatMoney(saleReport?.data?.summary?.totalPrice)}</Table.Summary.Cell>{" "}
            {/* Empty cell */}
            <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.totalDiscount)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.totalRevenue)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.totalPrime)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.profit)}</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      case ESaleReportConcerns.DISCOUNT:
        return (
          <Table.Summary.Row className="bg-[#e6fff6] font-semibold text-base">
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              {formatNumber(saleReport?.data?.summary?.totalOrder)}
            </Table.Summary.Cell>{" "}
            {/* Empty cell */}
            <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.totalDiscount)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.totalPrice)}</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      case ESaleReportConcerns.EMPLOYEE:
        return (
          <Table.Summary.Row className="bg-[#e6fff6] font-semibold text-base">
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              {formatMoney(saleReport?.data?.summary?.totalRevenue)}
            </Table.Summary.Cell>{" "}
            {/* Empty cell */}
            <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.saleReturn)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.realRevenue)}</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      case ESaleReportConcerns.SALE_RETURN:
        return (
          <Table.Summary.Row className="bg-[#e6fff6] font-semibold text-base">
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{null}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              {formatMoney(saleReport?.data?.summary?.totalRevenue)}
            </Table.Summary.Cell>{" "}
            {/* Empty cell */}
            <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.saleReturn)}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{formatMoney(saleReport?.data?.summary?.numberOfReturn)}</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      default:
        return;
    }
  };

  const labels = useMemo(() => {
    return saleReport?.data?.items?.map((item) => item.title);
  }, [saleReport]);

  const timeDataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Doanh thu thuần",
          data: saleReport?.data?.items?.map((item) => Number(item.realRevenue)),
          backgroundColor: "#0070F4",
        },
      ],
    }),
    [saleReport],
  );
  const revenueDataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Lợi nhuận",
          data: saleReport?.data?.items?.map((item) => Number(item.profit)),
          backgroundColor: "#0070F4",
        },
        {
          label: "Doanh thu",
          data: saleReport?.data?.items?.map((item) => Number(item.totalRevenue)),
          backgroundColor: "#00B63E",
        },
        {
          label: "Giá vốn",
          data: saleReport?.data?.items?.map((item) => Number(item.totalPrime)),
          backgroundColor: "#FFBA00",
        },
      ],
    }),
    [saleReport],
  );
  const discountDataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Giá trị hóa đơn",
          data: saleReport?.data?.items?.map((item) => Number(item.totalPrice)),
          backgroundColor: "#0070F4",
        },
        {
          label: "Giảm giá hóa đơn",
          data: saleReport?.data?.items?.map((item) => Number(item.totalDiscount)),
          backgroundColor: "#00B63E",
        },
      ],
    }),
    [saleReport],
  );
  const saleReturnDataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Giá trị hóa đơn trả",
          data: saleReport?.data?.items?.map((item) => Number(item.saleReturn)),
          backgroundColor: "#0070F4",
        },
        // {
        //   label: "Số lượng trả",
        //   data: saleReport?.data?.items?.map((item) => Number(item.numberOfReturn)),
        //   backgroundColor: "#00B63E",
        // },
      ],
    }),
    [saleReport],
  );

  return (
    <div>
      <div className="my-3 flex justify-end gap-4"></div>
      <div className="grid grid-cols-12 gap-6 ">
        <div className="col-span-2 flex items-center">
          <Search formFilter={formFilter} setFormFilter={setFormFilter} branches={branches} />
        </div>
        <div className="col-span-10">
          {formFilter.type === 1 ? (
            <div className="bg-white h-full p-5 rounded">
              <div className="text-center mb-5 flex flex-col gap-[10px]">
                <h4 className="text-2xl font-semibold">
                  Báo cáo lợi nhuận theo {saleReportLabels[formFilter.concern]?.toLowerCase()}
                </h4>
                <p>
                  Từ ngày {dayjs(formFilter.from).format("DD/MM/YYYY")} đến ngày{" "}
                  {dayjs(formFilter.to).format("DD/MM/YYYY")}
                </p>
                <p>Chi nhánh: {branches?.data?.items?.find((item) => item.id === branch)?.name}</p>
              </div>
              <Bar
                options={options}
                data={
                  formFilter.concern === ESaleReportConcerns.REVENUE
                    ? revenueDataSource
                    : formFilter.concern === ESaleReportConcerns.DISCOUNT
                    ? discountDataSource
                    : formFilter.concern === ESaleReportConcerns.SALE_RETURN
                    ? saleReturnDataSource
                    : timeDataSource
                }
              />
            </div>
          ) : (
            <div className="p-6 bg-[#88909C]">
              <div className="bg-white p-3">
                <div>Ngày lập: {dayjs().format("DD/MM/YYYY HH:mm")}</div>
                <div className="text-center mb-5 flex flex-col gap-[10px]">
                  <h4 className="text-2xl font-semibold">
                    Báo cáo lợi nhuận theo {saleReportLabels[formFilter.concern]?.toLowerCase()}
                  </h4>
                  <p>
                    Từ ngày {dayjs(formFilter.from).format("DD/MM/YYYY")} đến ngày{" "}
                    {dayjs(formFilter.to).format("DD/MM/YYYY")}
                  </p>
                  <p>Chi nhánh: {branches?.data?.items?.find((item) => item.id === branch)?.name}</p>
                </div>
                <CustomTable
                  dataSource={saleReport?.data?.items.map((item, index) => ({
                    ...item,
                    key: index + 1,
                  }))}
                  summary={(pageData) => renderSummary()}
                  columns={
                    formFilter.concern === ESaleReportConcerns.REVENUE
                      ? revenueColumns
                      : formFilter.concern === ESaleReportConcerns.DISCOUNT
                      ? discountColumns
                      : formFilter.concern === ESaleReportConcerns.EMPLOYEE
                      ? employeeColumns
                      : columns
                  }
                  loading={isLoading}
                  expandable={{
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    expandedRowRender: (record) => {
                      const title = record.title.split("-");
                      if (title?.length === 3) {
                        const newDate = `${title[2]}-${title[1]}-${title[0]}`;
                        return (
                          <RowDetail record={record} branchId={branch} from={newDate} to={newDate} fromTime={null} />
                        );
                      } else {
                        let toTime = record.title.split(":");
                        toTime = Number(toTime[0]) + 1 + ":00";
                        return (
                          <RowDetail
                            record={record}
                            branchId={branch}
                            from={formFilter.from}
                            to={formFilter.to}
                            fromTime={record?.title + ":00"}
                            toTime={toTime}
                          />
                        );
                      }
                    },
                    expandIcon: () => <></>,
                    expandedRowKeys: Object.keys(expandedRowKeys).map((key) => Number(key) + 1),
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        // Toggle expandedRowKeys state here
                        if (expandedRowKeys[record.key - 1]) {
                          const { [record.key - 1]: value, ...remainingKeys } = expandedRowKeys;
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
