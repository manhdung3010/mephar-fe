import axiosClient from './index';

export function getProvinces() {
  return axiosClient.get('address');
}

export function getDistricts(provinceId: number) {
  return axiosClient.get(`address/${provinceId}`);
}

export function getWards(provinceId: number, districtId: number) {
  return axiosClient.get(`address/${provinceId}/${districtId}`);
}

export function getCountries(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get(`country-produce`, { params });
}
