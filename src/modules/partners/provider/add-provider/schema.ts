import * as yup from 'yup';

import { regexPhoneNumber } from '@/constants';

export const schema = yup.object().shape({
  name: yup.string().required('Đây là trường bắt buộc!'),
  email: yup.string().email('Vui lòng nhập đúng định dạng form email'),
  phone: yup
    .string()
    .matches(regexPhoneNumber, 'Vui lòng nhập đúng định dạng số điện thoại')
    .required('Đây là trường bắt buộc!'),
  address: yup.string(),
  provinceId: yup.number(),
  districtId: yup.number(),
  wardId: yup.number(),
  companyName: yup.string(),
  taxCode: yup.string(),
  groupSupplierId: yup.number().required('Đây là trường bắt buộc!'),
  note: yup.string(),
  branchId: yup.number(),
  code: yup.string(),
});
