import axiosClient from "./index";

export function createMoveProduct(payload) {
  return axiosClient.post(`move`, payload);
}
export function createReceiveMoveProduct(payload, id: number) {
  return axiosClient.patch(`move/${id}/receive`, payload);
}
export function getMove(params: {
  page: number;
  limit: number;
  keyword: any;
  status: any;
  movedBy: any;
  fromBranchId: any;
  toBranchId: any;
  movedAt: any;
  receivedAt: any;
  receivedBy: any;
  branchId: any;
}) {
  return axiosClient.get("move", { params });
}
export function getMoveDetail(id: any) {
  return axiosClient.get(`move/${id}`);
}
