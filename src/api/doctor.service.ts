import axiosClient from './index';

export function getDoctor(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('doctor', { params });
}

export function getDoctorDetail(id: number) {
  return axiosClient.get(`doctor/${id}`);
}

export function updateDoctor(id: number, payload) {
  return axiosClient.patch(`doctor/${id}`, payload);
}

export function createDoctor(payload) {
  return axiosClient.post(`doctor`, payload);
}

export function deleteDoctor(id: number) {
  return axiosClient.delete(`doctor/${id}`);
}

export function getMajor(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('specialist', { params });
}

export function getMajorDetail(id: number) {
  return axiosClient.get(`specialist/${id}`);
}

export function updateMajor(id: number, payload) {
  return axiosClient.patch(`specialist/${id}`, payload);
}

export function createMajor(payload) {
  return axiosClient.post(`specialist`, payload);
}

export function deleteMajor(id: number) {
  return axiosClient.delete(`specialist/${id}`);
}

export function getLevel(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('level', { params });
}

export function getLevelDetail(id: number) {
  return axiosClient.get(`level/${id}`);
}

export function updateLevel(id: number, payload) {
  return axiosClient.patch(`level/${id}`, payload);
}

export function createLevel(payload) {
  return axiosClient.post(`level`, payload);
}

export function deleteLevel(id: number) {
  return axiosClient.delete(`level/${id}`);
}

export function getWorkPlace(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('work-place', { params });
}

export function getWorkPlaceDetail(id: number) {
  return axiosClient.get(`work-place/${id}`);
}

export function updateWorkPlace(id: number, payload) {
  return axiosClient.patch(`work-place/${id}`, payload);
}

export function createWorkPlace(payload) {
  return axiosClient.post(`work-place`, payload);
}

export function deleteWorkPlace(id: number) {
  return axiosClient.delete(`work-place/${id}`);
}

export function getHospital(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('health-facility', { params });
}

export function getHospitalDetail(id: number) {
  return axiosClient.get(`health-facility/${id}`);
}

export function updateHospital(id: number, payload) {
  return axiosClient.patch(`health-facility/${id}`, payload);
}

export function createHospital(payload) {
  return axiosClient.post(`health-facility`, payload);
}

export function deleteHospital(id: number) {
  return axiosClient.delete(`health-facility/${id}`);
}

export function getPrescription(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('prescription', { params });
}

export function getPrescriptionDetail(id: number) {
  return axiosClient.get(`prescription/${id}`);
}

export function updatePrescription(id: number, payload) {
  return axiosClient.patch(`prescription/${id}`, payload);
}

export function createPrescription(payload) {
  return axiosClient.post(`prescription`, payload);
}

export function deletePrescription(id: number) {
  return axiosClient.delete(`prescription/${id}`);
}
