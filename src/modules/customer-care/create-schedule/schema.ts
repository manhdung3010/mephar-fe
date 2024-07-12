import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  time: yup.string().required("Đây là trường bắt buộc!"),
  lat: yup.number().required("Đây là trường bắt buộc!"),
  lng: yup.number().required("Đây là trường bắt buộc!"),
  listCustomer: yup
    .array(
      yup.object({
        id: yup.number(),
        lat: yup.string(),
        lng: yup.string(),
        address: yup.string(),
      })
    )
    .required("Đây là trường bắt buộc!"),
});
