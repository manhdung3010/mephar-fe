import axiosClient from './index';

export function getPriceSetting(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId: number;
}) {
  return axiosClient.get('product/price/setting', { params });
}

export function updatePriceSetting(id: number, payload) {
  return axiosClient.patch(`product/price/setting/${id}`, payload);
}

// export function getPriceSettingDetail(id: number) {
//   return axiosClient.get(`product/price/setting/${id}`);
// }

// export function createPriceSetting(payload) {
//   return axiosClient.post(`product/price/setting`, payload);
// }

// export function deletePriceSetting(id: number) {
//   return axiosClient.delete(`product/price/setting/${id}`);
// }
