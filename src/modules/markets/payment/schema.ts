import { regexPhoneNumber } from "@/constants";
import * as yup from "yup";

export const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Đây là trường bắt buộc!")
    .matches(regexPhoneNumber, "Vui lòng nhập đúng định dạng số điện thoại"),
  fullName: yup.string().required("Đây là trường bắt buộc!"),
  wardId: yup.number().required("Đây là trường bắt buộc!"),
  districtId: yup.number().required("Đây là trường bắt buộc!"),
  provinceId: yup.number().required("Đây là trường bắt buộc!"),
  address: yup.string(),
  isDefaultAddress: yup.boolean(),
});
