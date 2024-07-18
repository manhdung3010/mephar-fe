import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  time: yup.string().required("Đây là trường bắt buộc!"),
  lat: yup.string(),
  lng: yup.string(),
  latEnd: yup.string(),
  lngEnd: yup.string(),
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
