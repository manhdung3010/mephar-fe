import axiosClient from "./index";

export function createTrip(payload) {
  return axiosClient.post(`trip`, payload);
}
export function updateTrip(id: number, payload) {
  return axiosClient.patch(`trip/${id}`, payload);
}
export function getAllTrip(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get(`trip`, { params });
}
export function getTripDetail(id: any) {
  return axiosClient.get(`trip/${id}`);
}
export function searchPlace(params: { keyword: string }) {
  return axiosClient.get(`trip/search/ref`, { params });
}
export function searchPlaceByLatLng(params: { lat: string; lng: string }) {
  return axiosClient.get(`trip/search/reverse`, { params });
}
export function getLatLng(params: { refId: string }) {
  return axiosClient.get(`trip/search/place`, { params });
}
export function deleteTrip(id: any) {
  return axiosClient.delete(`trip/${id}`);
}
export function updateCustomerStatus(customerId: string, status: string, payload: any) {
  return axiosClient.patch(`trip/changeStatus/${customerId}/${status}`, payload);
}

// lấy bán kính tìm kiếm
export function getGeo(page: number, limit: number, payload: any) {
  return axiosClient.post(`trip/geofencing?page=${page}&limit=${limit}`, payload);
}

// lịch sử ghé thăm của khách hàng
export function getHistoryCustomer(id: string) {
  return axiosClient.get(`customer/${id}/history-visited`);
}

// lấy địa chỉ từ tọa độ
export const getAddress = (params: { lat: number; lng: number }) => {
  return axiosClient.get(`trip/search/reverse`, { params });
};

// vẽ đường đi
export const getRouting = (payload: { listPoint: { lng: string; lat: string }[]; vehicle: string }) => {
  return axiosClient.post(`trip/map-routing`, payload);
};
