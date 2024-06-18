import axiosClient from "./index";

export function getPointDetail(type: string) {
  return axiosClient.get(`point/${type}`);
}
export function getPointStatus() {
  return axiosClient.get(`point/check/status`);
}
export function updatePointStatus() {
  return axiosClient.patch(`point`);
}

// export function updateBatch(id: number, payload) {
//   return axiosClient.patch(`batch/${id}`, payload);
// }

export function createPoint(payload) {
  return axiosClient.post(`point`, payload);
}
