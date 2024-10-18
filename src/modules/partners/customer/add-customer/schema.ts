import * as yup from "yup";

import { regexPhoneNumber } from "@/constants";

export const schema = yup.object().shape({
  code: yup.string(),
  fullName: yup.string().required("Đây là trường bắt buộc!"),
  email: yup.string().email("Vui lòng nhập đúng định dạng form email"),
  phone: yup
    .string()
    .required("Đây là trường bắt buộc!")
    .matches(regexPhoneNumber, "Vui lòng nhập đúng định dạng số điện thoại"),
  address: yup.string(),
  provinceId: yup.number(),
  districtId: yup.number(),
  wardId: yup.number(),
  birthday: yup.string(),
  gender: yup.string(),
  status: yup.string(),
  type: yup.number(),
  taxCode: yup.string(),
  groupCustomerId: yup.array(),
  note: yup.string(),
  avatarId: yup.number(),
  lng: yup.string(),
  lat: yup.string(),
  point: yup.string(),
  facebook: yup.string(),
  companyName: yup.string(),
});
