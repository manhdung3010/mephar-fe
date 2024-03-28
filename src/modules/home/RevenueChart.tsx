/* eslint-disable no-plusplus */
import { useQuery } from '@tanstack/react-query';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { getRevenueReport } from '@/api/report.service';
import ArrowRight from '@/assets/arrow-right.svg';
import { CustomSelect } from '@/components/CustomSelect';

import { getDateRange } from './BestSellerProductChart';

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
  Date = 'date',
  Day = 'day',
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
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

  const { data } = useQuery(
    ['REVENUE_CHART', revenueFilter.viewType, revenueFilter.dateRange, branchId],
    () =>
      getRevenueReport({
        type: revenueFilter.viewType,
        dateRange: getDateRange(revenueFilter.dateRange),
        branchId
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
          label: 'Doanh thu',
          data: data?.data?.items?.map((item) => item.revenue),
          backgroundColor: '#0070F4',
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

            <div className="text-red-main">2,274,000</div>
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
              label: 'Tháng hiện tại',
              value: FilterDateType.CURRENT_MONTH,
            },
            { label: 'Tháng trước', value: FilterDateType.PRE_MONTH },
          ]}
          value={revenueFilter.dateRange}
        />
      </div>

      <Bar options={options} data={dataSource} />
    </>
  );
}
