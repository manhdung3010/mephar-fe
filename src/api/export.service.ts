import axiosClient from ".";

// Xuất dữ liệu doctor ra Excel
export function getDoctorExcel() {
  return axiosClient.get("/doctor/export/excel", {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

// Xuất file mẫu cho doctor
export function getDoctorExample() {
  return axiosClient.get(`/doctor/export/example`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

// Xuất dữ liệu customer ra Excel
export function getCustomerExcel() {
  return axiosClient.get(`/customer/export/excel`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

// Xuất file mẫu cho customer
export function getCustomerExample() {
  return axiosClient.get(`/customer/export/example`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

export function getCustomerExampleKiot() {
  return axiosClient.get(`/customer/export/example?type=kiotviet`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

// Xuất dữ liệu product ra Excel
export function getProductExcel(params: { branchId: number }) {
  return axiosClient.get(`/product/export/excel`, {
    responseType: "blob",
    params: params, // Pass params directly here
  });
}

// Xuất file mẫu cho product
export function getProductExample() {
  return axiosClient.get(`/product/export/example`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

export function getProductExampleKiot() {
  return axiosClient.get(`/product/export/example?type=kiotviet`, {
    responseType: "blob", // Ensure the response is treated as binary data
  });
}

// Xuất dữ liệu trả hàng nhập ra Excel
export function getProductReturnExcel(params: { branchId: number }) {
  return axiosClient.get(`/purchase-return/export/excel`, {
    responseType: "blob",
    params: params, // Pass params directly here
  });
}

// Xuất dữ liệu trả hàng  ra Excel
export function getReturnExcel(params: { branchId: number }) {
  return axiosClient.get(`/sale-return/export/excel`, {
    responseType: "blob",
    params: params, // Pass params directly here
  });
}

// Xuất dữ liệu ncc  ra Excel
export function getSupplierExcel(params: { branchId: number }) {
  return axiosClient.get(`/supplier/export/example`, {
    responseType: "blob",
    params: params, // Pass params directly here
  });
}
