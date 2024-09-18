import axiosClient from "./index";

export function createConfigProduct(payload) {
  return axiosClient.post(`market/config/product`, payload);
}
export function updateConfigProduct(id, payload) {
  return axiosClient.patch(`market/config/product/${id}`, payload);
}
export function getConfigProduct(params: {
  page: number;
  limit: number;
  keyword: any;
  status?: any;
  type?: string;
  groupAgencyId?: string;
  agencyId?: string;
  groupProductId?: string;
  "createdAt[start]"?: string;
  "createdAt[end]"?: string;
  isConfig?: boolean;
  otherBranchId?: string;
  branchId: string;
}) {
  return axiosClient.get(`market/config/product`, { params });
}

export function deleteConfigProduct(id: string) {
  return axiosClient.delete(`market/config/product/${id}`);
}
export function updateConfigStatus(
  id: string,
  status: string,
  branchId: string
) {
  return axiosClient.patch(
    `market/config/product/changeStatus/${id}/${status}?branchId=${branchId}`
  );
}
export function getConfigProductDetail(id: string) {
  return axiosClient.get(`market/config/product/${id}`);
}

// product privite
export function getConfigProductPrivate(
  branchId: string,
  toBranchId: string,
  params
) {
  return axiosClient.get(
    `market/sell/product-private?branchId=${branchId}&toBranchId=${toBranchId}`,
    { params }
  );
}

// đại lý - group agency
export function getAgency(params) {
  return axiosClient.get(`market/config/agency`, { params });
}
export function getAgencyGroup(params) {
  return axiosClient.get(`market/config/group-agency`, { params });
}
export function createAgencyGroup(payload) {
  return axiosClient.post(`market/config/group-agency`, payload);
}

// Chợ
export function getSaleProductDetail(id: string, branchId: string) {
  return axiosClient.get(`market/sell/product/${id}?branchId=${branchId}`);
}
export function createMarketCart(payload) {
  return axiosClient.post(`market/sell/cart`, payload);
}
export function getMarketCart(params) {
  return axiosClient.get(`market/sell/cart`, { params });
}
export function deletMarketCart(id: string) {
  return axiosClient.delete(`market/sell/cart/${id}`);
}
export function updateMarketCart(id: string, quantity: number) {
  return axiosClient.patch(`market/sell/cart/${id}/${quantity}`);
}
export function updateMarketCartSelect(payload: {
  branchId: string;
  ids: string[];
}) {
  return axiosClient.patch(`market/sell/cart`, payload);
}
export function createShipAddress(payload) {
  return axiosClient.post(`market/sell/address`, payload);
}
export function updateShipAddress(
  id: string,
  branchId?: string,
  payload?: any
) {
  return axiosClient.patch(
    `market/sell/address/${id}?branchId=${branchId}`,
    payload
  );
}
export function getShipAddress(params) {
  return axiosClient.get(`market/sell/address`, { params });
}
export function getShipAddressDetail(id: string, branchId: string) {
  return axiosClient.get(`market/sell/address/${id}?branchId=${branchId}`);
}

// order
export function createMarketOrder(payload) {
  return axiosClient.post(`market/sell/market-order`, payload);
}
export function getMarketOrder(params) {
  return axiosClient.get(`market/sell/market-order`, { params });
}
export function getMarketOrderDetail(id: string, branchId: string) {
  return axiosClient.get(`market/sell/market-order/${id}?branchId=${branchId}`);
}
export function updateSeri(payload, branchId: string) {
  return axiosClient.patch(`market/sell/seri?branchId=${branchId}`, payload);
}
export function updateMarketOrder(id: string, payload) {
  return axiosClient.patch(
    `market/sell/market-order/update-order/${id}`,
    payload
  );
}
export function checkSeriValid(seri: string, params) {
  return axiosClient.get(`market/sell/seri/check/${seri}`, { params });
}

// payment order
export function createPaymentOrder(id: string, payload) {
  return axiosClient.patch(`market/sell/market-order/payment/${id}`, payload);
}

// update order status
export function updateMarketOrderStatus(id: string, payload, branchId: string) {
  return axiosClient.patch(
    `market/sell/market-order/${id}?branchId=${branchId}`,
    payload
  );
}

// store
export function getMarketStore(params) {
  return axiosClient.get(`market/sell/branch`, { params });
}
export function getMarketStoreDetail(id: string) {
  return axiosClient.get(`market/sell/branch/${id}`);
}

// follow store
export function getFollowStore(id: string, branchId: string) {
  return axiosClient.get(`market/config/agency/${id}?branchId=${branchId}`);
}
export function createFollowStore(payload) {
  return axiosClient.post(`market/config/agency`, payload);
}
export function getAllFollowStore(params) {
  return axiosClient.get(`market/config/agency`, { params });
}
export function updateStoreStatus(
  id: string,
  status: string,
  payload?: any,
  branchId?: string
) {
  return axiosClient.patch(
    `market/config/agency/${id}/${status}?branchId=${branchId}`,
    payload
  );
}

// check product
export function checkProduct(seri: string) {
  return axiosClient.get(`market/sell/seri/getMarketOrder/${seri}`);
}
