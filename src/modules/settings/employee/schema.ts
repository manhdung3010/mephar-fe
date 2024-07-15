import * as yup from 'yup';

import { regexPhoneNumber } from '@/constants';

export const schema = yup.object().shape({
  username: yup.string().required('Đây là trường bắt buộc!'),
  fullName: yup.string().required('Đây là trường bắt buộc!'),
  phone: yup
    .string()
    .matches(regexPhoneNumber, 'Vui lòng nhập đúng định dạng số điện thoại')
    .required('Đây là trường bắt buộc!'),
  password: yup.string().min(6).required('Đây là trường bắt buộc!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Mật khẩu xác nhận không trùng khớp'),
  email: yup.string().email('Vui lòng nhập đúng định dạng form email'),
  birthday: yup.string(),
  address: yup.string(),
  roleId: yup.number().required('Đây là trường bắt buộc!'),
  listBranchId: yup.array().of(yup.number()).required('Đây là trường bắt buộc!'),
  position: yup.string(),
});
