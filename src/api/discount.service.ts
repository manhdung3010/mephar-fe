import axiosClient from "./index";

export function getDiscount(params: {
  page: number;
  limit: number;
  keyword?: string;
  name?: string;
}) {
  return axiosClient.get("promotion-program", { params });
}
