import * as yup from "yup";

export const schema = yup.object().shape({
  code: yup.string(),
  paymentDate: yup.string(),
  value: yup.number().required("Đây là trường bắt buộc!"),
  name: yup.string().required("Đây là trường bắt buộc!"),
  typeId: yup.number().required("Đây là trường bắt buộc!"),
  targetId: yup.number().required("Đây là trường bắt buộc!"),
  target: yup.string(),
  userId: yup.number().required("Đây là trường bắt buộc!"),
  note: yup.string(),
});
