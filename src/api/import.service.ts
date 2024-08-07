import axiosClient from ".";

// Nhập dữ liệu doctor từ file Excel
export function uploadDoctorExcel(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post(`/doctor/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Nhập dữ liệu customer từ file Excel
export function uploadCustomerExcel(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post(`/customer/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Nhập dữ liệu product từ file Excel
export function uploadProductExcel(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post(`/product/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
