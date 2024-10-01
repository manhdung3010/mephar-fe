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
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

import { getBestSellerProduct } from "@/api/report.service";
import { CustomSelect } from "@/components/CustomSelect";
import { generalId } from "@/layouts/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y" as const,
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
    y: {
      grid: {
        display: false,
      },
    },
  },
};

export enum FilterDateType {
  CURRENT_MONTH = 1,
  PRE_MONTH = 2,
}

export enum ViewType {
  Revenue = "revenue",
  Quantity = "quantity",
}

export const getDateRange = (dateRange) => {
  if (dateRange === FilterDateType.CURRENT_MONTH) {
    return {
      startDate: dayjs().startOf("M").toISOString(),
      endDate: dayjs().endOf("M").toISOString(),
    };
  }
  if (dateRange === FilterDateType.PRE_MONTH) {
    return {
      startDate: dayjs().add(-1, "M").startOf("M").toISOString(),
      endDate: dayjs().add(-1, "M").endOf("M").toISOString(),
    };
  }

  return undefined;
};

export function BestSellerProductChart({ branchId }: { branchId: number }) {
  const [productFilter, setProductFilter] = useState({
    dateRange: FilterDateType.CURRENT_MONTH,
    viewType: ViewType.Revenue,
  });

  const { data } = useQuery(
    [
      "BEST_SELLER_PRODUCT_CHART",
      productFilter.viewType,
      productFilter.dateRange,
      branchId,
    ],
    () =>
      getBestSellerProduct({
        type: productFilter.viewType,
        dateRange: getDateRange(productFilter.dateRange),
        ...(String(branchId) === generalId ? {} : { branchId }),
      })
  );

  const labels = useMemo(() => {
    return data?.data?.items?.map((item) => item.name);
  }, [data]);

  const dataSource = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label:
            productFilter.viewType === ViewType.Revenue
              ? "Doanh thu"
              : "Doanh số",
          data: data?.data?.items?.map((item) =>
            productFilter.viewType === ViewType.Revenue
              ? item.revenue
              : item.quantity
          ),
          backgroundColor: "#0070F4",
        },
      ],
    }),
    [data]
  );

  if (!dataSource) return <></>;

  return (
    <>
      <div className="mb-3  font-bold text-[#15171A]">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="mr-5">Top 10 hàng hóa bán chạy Tháng này</div>

            <CustomSelect
              onChange={(value) =>
                setProductFilter((pre) => ({ ...pre, viewType: value }))
              }
              className="w-[200px] !border-none"
              wrapClassName="!w-[200px] "
              options={[
                {
                  label: (
                    <div className="text-red-main">Theo doanh thu thuần</div>
                  ),
                  value: ViewType.Revenue,
                },
                {
                  label: <div className="text-red-main">Theo doanh số</div>,
                  value: ViewType.Quantity,
                },
              ]}
              value={productFilter.viewType}
            />
          </div>

          <CustomSelect
            onChange={(value) =>
              setProductFilter((pre) => ({ ...pre, dateRange: value }))
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
            value={productFilter.dateRange}
          />
        </div>
      </div>

      <Bar options={options} data={dataSource} />
    </>
  );
}
