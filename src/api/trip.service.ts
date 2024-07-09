import axiosClient from "./index";

export function createTrip(payload) {
  return axiosClient.post(`trip`, payload);
}
export function getAllTrip(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get(`trip`, { params });
}
export function searchPlace(params: { keyword: string }) {
  return axiosClient.get(`trip/search/ref`, { params });
}
export function getLatLng(params: { refId: string }) {
  return axiosClient.get(`trip/search/place`, { params });
}
