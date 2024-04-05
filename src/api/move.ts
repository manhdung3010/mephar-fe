import axiosClient from "./index";

export function createMoveProduct(payload) {
  return axiosClient.post(`move`, payload);
}
