import * as yup from "yup";

export const schema = yup.object().shape({
  code: yup.string(),
  name: yup.string().required("Đây là trường bắt buộc!"),
  status: yup.string(),
  note: yup.string(),
  target: yup.string(),
  type: yup.string(),
  conditions: yup.array(),
  branch: yup.number(),
});
