import axiosClient from './index';

export function uploadSingleFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  return axiosClient.post('external/image/upload', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
}
