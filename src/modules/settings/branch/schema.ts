import * as yup from 'yup';

import { regexPhoneNumber } from '@/constants';

export const schema = yup.object().shape({
  name: yup.string().required('Đây là trường bắt buộc!'),
  phone: yup
    .string()
    .matches(regexPhoneNumber, 'Vui lòng nhập đúng định dạng số điện thoại')
    .required('Đây là trường bắt buộc!'),
  code: yup.string(),
  zipCode: yup.string(),
  address1: yup.string().required('Đây là trường bắt buộc!'),
  address2: yup.string(),
  provinceId: yup.number(),
  districtId: yup.number(),
  wardId: yup.number(),
  isDefaultBranch: yup.boolean().required('Đây là trường bắt buộc!'),
  status: yup.number().required('Đây là trường bắt buộc!'),
});
