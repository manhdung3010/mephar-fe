import * as yup from "yup";

export const schema = yup.object().shape({
  username: yup.string().required("Đây là trường bắt buộc!"),
  password: yup
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(32, "Mật khẩu tối đa 32 ký tự")
    .required("Đây là trường bắt buộc!"),
});
