import * as yup from 'yup';

import { regexPhoneNumber } from '@/constants';

export const schema = yup.object().shape({
  name: yup.string().required('Đây là trường bắt buộc!'),
  email: yup.string(),
  phone: yup
    .string()
    .matches(regexPhoneNumber, 'Vui lòng nhập đúng định dạng số điện thoại'),
  gender: yup.string(),
  avatarId: yup.number(),
  specialistId: yup.number(),
  levelId: yup.number(),
  workPlaceId: yup.number(),
  address: yup.string(),
  provinceId: yup.number(),
  districtId: yup.number(),
  wardId: yup.number(),
  status: yup.number(),
  note: yup.string(),
  code: yup.string(),
});
