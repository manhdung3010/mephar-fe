/* eslint-disable no-plusplus */
import { useQuery } from "@tanstack/react-query";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

import { getRevenueReport, getSaleReport } from "@/api/report.service";
import ArrowRight from "@/assets/arrow-right.svg";
import { CustomSelect } from "@/components/CustomSelect";

import { getDateRange } from "./BestSellerProductChart";
import dayjs from "dayjs";
import { formatMoney } from "@/helpers";
import { generalId } from "@/layouts/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export enum FilterDateType {
  CURRENT_MONTH = 1,
  PRE_MONTH = 2,
}

export enum ViewType {
  Date = "date",
  Day = "day",
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
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

export function RevenueChart({ branchId }: { branchId: number }) {
  const [revenueFilter, setRevenueFilter] = useState({
    dateRange: FilterDateType.CURRENT_MONTH,
    viewType: ViewType.Date,
  });

  const [formFilter, setFormFilter] = useState({
    type: 1,
    concern: "TIME",
    branchId: branchId ? branchId : undefined,
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const [branchIdReady, setBranchIdReady] = useState(false);

  useEffect(() => {
    if (branchId) {
      setFormFilter((prev) => ({
        ...prev,
        branchId: branchId,
      }));
      setBranchIdReady(true);
    }
  }, [branchId]);

  const { data: saleReport, isLoading: isSaleReportLoading } = useQuery(
    [
      "SALE_REPORT",
      formFilter.from,
      formFilter.to,
      formFilter.concern,
      formFilter.branchId,
    ],
    () =>
      getSaleReport({
        from: formFilter.from,
        to: formFilter.to,
        ...(String(formFilter.branchId) === generalId ? {} : { branchId }),
        concern: formFilter.concern,
      }),
    {
      enabled: branchIdReady,
    }
  );

  const { data } = useQuery(
    [
      "REVENUE_CHART",
      revenueFilter.viewType,
      revenueFilter.dateRange,
      branchId,
    ],
    () =>
      getRevenueReport({
        type: revenueFilter.viewType,
        dateRange: getDateRange(revenueFilter.dateRange),
        ...(String(branchId) === generalId ? {} : { branchId }),
      })
  );

  const labels = useMemo(() => {
    return data?.data?.items?.map((item) => item.label);
  }, [data]);

  const dataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: data?.data?.items?.map((item) => item.revenue),
          backgroundColor: "#0070F4",
        },
      ],
    }),
    [data]
  );

  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="mb-3 flex items-center font-bold text-[#15171A]">
            <div className="mr-5">Doanh thu thuần Tháng này</div>

            <div className="mr-1 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-black">
              <Image src={ArrowRight} alt="" />
            </div>

            <div className="text-red-main">
              {formatMoney(saleReport?.data?.summary?.realRevenue)}
            </div>
          </div>

          <div className="mb-8 flex">
            <div className="w-[88px] text-center">
              <div
                className="mb-1 cursor-pointer"
                onClick={() =>
                  setRevenueFilter((pre) => ({
                    ...pre,
                    viewType: ViewType.Date,
                  }))
                }
              >
                Theo ngày
              </div>
              {revenueFilter.viewType === ViewType.Date && (
                <div className="h-[2px] w-full bg-red-main" />
              )}
            </div>
            <div className="w-[88px] text-center">
              <div
                className="mb-1 cursor-pointer"
                onClick={() =>
                  setRevenueFilter((pre) => ({
                    ...pre,
                    viewType: ViewType.Day,
                  }))
                }
              >
                Theo thứ
              </div>
              {revenueFilter.viewType === ViewType.Day && (
                <div className="h-[2px] w-full bg-red-main" />
              )}
            </div>
          </div>
        </div>

        <CustomSelect
          onChange={(value) =>
            setRevenueFilter((pre) => ({ ...pre, dateRange: value }))
          }
          className="w-[200px] !rounded"
          wrapClassName="!w-[200px] "
          options={[
            {
              label: "Tháng hiện tại",
              value: FilterDateType.CURRENT_MONTH,
            },
            { label: "Tháng trước", value: FilterDateType.PRE_MONTH },
          ]}
          value={revenueFilter.dateRange}
        />
      </div>

      <Bar options={options} data={dataSource} />
    </>
  );
}
