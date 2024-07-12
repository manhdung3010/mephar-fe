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
export function getTripDetail(id: any) {
  return axiosClient.get(`trip/${id}`);
}
export function searchPlace(params: { keyword: string }) {
  return axiosClient.get(`trip/search/ref`, { params });
}
export function getLatLng(params: { refId: string }) {
  return axiosClient.get(`trip/search/place`, { params });
}
export function updateCustomerStatus(
  customerId: string,
  status: string,
  payload: any
) {
  return axiosClient.patch(
    `trip/changeStatus/${customerId}/${status}`,
    payload
  );
}

// lấy bán kính tìm kiếm
export function getGeo(page: number, limit: number, payload: any) {
  return axiosClient.post(
    `trip/geofencing?page=${page}&limit=${limit}`,
    payload
  );
}
