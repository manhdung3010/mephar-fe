import axiosClient from "./index";

export function getBestSellerProduct(params: {
  type: string;
  dateRange?: { startDate?: string; endDate?: string };
  branchId?: number;
}) {
  return axiosClient.get("report/product-report", { params });
}

export function getRevenueReport(params: {
  type: string;
  dateRange?: { startDate?: string; endDate?: string };
  branchId?: number;
}) {
  return axiosClient.get("report/revenues-report", { params });
}
