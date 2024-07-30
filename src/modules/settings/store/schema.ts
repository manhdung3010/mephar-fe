import * as yup from "yup";

import { regexPhoneNumber } from "@/constants";

export const schema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  // email: yup
  //   .string()
  //   .email('Vui lòng nhập đúng định dạng form email')
  //   .required('Đây là trường bắt buộc!'),
  phone: yup
    .string()
    .matches(regexPhoneNumber, "Vui lòng nhập đúng định dạng số điện thoại")
    .required("Đây là trường bắt buộc!"),
  address: yup.string().required("Đây là trường bắt buộc!"),
  provinceId: yup.number().required("Đây là trường bắt buộc!"),
  districtId: yup.number().required("Đây là trường bắt buộc!"),
  wardId: yup.number().required("Đây là trường bắt buộc!"),
  businessRegistrationImageId: yup.number().nullable(),
  businessRegistrationNumber: yup.string().required("Đây là trường bắt buộc!"),
  logoId: yup.string().nullable(),
});
