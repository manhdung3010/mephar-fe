import axiosClient from "./index";

export function createMoveProduct(payload) {
  return axiosClient.post(`move`, payload);
}
export function getMove(params: {
  page: number;
  limit: number;
  keyword: string;
  status: string;
  movedBy: string;
  fromBranchId: string;
  toBranchId: string;
  movedAt: string;
  receivedAt: string;
  receivedBy: string;
  branchId: any;
}) {
  return axiosClient.get("move", { params });
}
