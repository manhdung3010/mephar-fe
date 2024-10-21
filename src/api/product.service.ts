import axiosClient from "./index";

export function getProduct(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
  listProductUnitId?: string;
}) {
  return axiosClient.get("product", { params });
}

export function updateProduct(id: number, payload) {
  return axiosClient.patch(`product/${id}`, payload);
}

export function updateProductStatus(id: number, payload) {
  return axiosClient.patch(`product/${id}/status`, payload);
}

export function getProductDetail(id: number) {
  return axiosClient.get(`product/${id}`);
}

export function createProduct(payload) {
  return axiosClient.post(`product`, payload);
}

export function deleteProduct(id: number) {
  return axiosClient.delete(`product/${id}`);
}

export function getDosage(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get("dosage", { params });
}

export function updateDosage(id: number, payload) {
  return axiosClient.patch(`dosage/${id}`, payload);
}

export function createDosage(payload) {
  return axiosClient.post(`dosage`, payload);
}

export function deleteDosage(id: number) {
  return axiosClient.delete(`dosage/${id}`);
}

export function getProductCategory(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get("product-category/list", { params });
}

export function updateProductCategory(id: number, payload) {
  return axiosClient.put(`product-category/update/${id}`, payload);
}

export function createProductCategory(payload) {
  return axiosClient.post(`product-category/create`, payload);
}

export function deleteProductCategory(id: number) {
  return axiosClient.delete(`product-category/delete/${id}`);
}

export function getPosition(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get("position", { params });
}

export function updatePosition(id: number, payload) {
  return axiosClient.patch(`position/${id}`, payload);
}

export function createPosition(payload) {
  return axiosClient.post(`position`, payload);
}

export function deletePosition(id: number) {
  return axiosClient.delete(`position/${id}`);
}

export function getManufacture(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get("manufacture", { params });
}

export function updateManufacture(id: number, payload) {
  return axiosClient.patch(`manufacture/${id}`, payload);
}

export function createManufacture(payload) {
  return axiosClient.post(`manufacture`, payload);
}

export function deleteManufacture(id: number) {
  return axiosClient.delete(`manufacture/${id}`);
}

export function getGroupProduct(params: { page: number; limit: number; keyword?: string }) {
  return axiosClient.get("group-product", { params });
}

export function updateGroupProduct(id: number, payload) {
  return axiosClient.put(`group-product/${id}`, payload);
}

export function createGroupProduct(payload) {
  return axiosClient.post(`group-product`, payload);
}

export function deleteGroupProduct(id: number) {
  return axiosClient.delete(`group-product/${id}`);
}

export function getInboundProducts(params: { page: number; limit: number; keyword?: string; branchId?: number }) {
  return axiosClient.get("product/inbound/master", { params });
}

export function getSaleProducts(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
  productUnit?: number;
  listProductUnitId?: string;
}) {
  return axiosClient.get("product/sale/master", { params });
}

export function getSampleMedicines(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
  isSale?: boolean;
  status?: number;
}) {
  return axiosClient.get("sample-prescription", { params });
}

export function getSampleMedicineDetail(id: number) {
  return axiosClient.get(`sample-prescription/${id}`);
}

export function createSampleMedicine(payload) {
  return axiosClient.post(`sample-prescription`, payload);
}

export function updateSampleMedicine(id: number, payload) {
  return axiosClient.patch(`sample-prescription/${id}`, payload);
}

export function deleteSampleMedicine(id: number) {
  return axiosClient.delete(`sample-prescription/${id}`);
}

export function updateSampleMedicineStatus(id: number, payload) {
  return axiosClient.patch(`sample-prescription/${id}/status`, payload);
}

// warehouse card
export function getWareHouseCard(params: { productId: number; page: number; limit: number; branchId?: number }) {
  return axiosClient.get("warehouse/card", { params });
}
// product expire
export function getProductExpired(params: { productId: number; page: number; limit: number; branchId?: number }) {
  return axiosClient.get("batch", { params });
}

export function getProductExpiredBatch(params: { productId: number; page: number; limit: number; branchId?: number }) {
  return axiosClient.get("batch", { params });
}

// product expire
export function getProductInventory(productId: number, params) {
  return axiosClient.get(`product/${productId}/inventory`, { params });
}
