import * as yup from "yup";

export const schema = yup.object().shape({
  lng: yup.string(),
  lat: yup.string(),
  radius: yup.number().required("Đây là trường bắt buộc!"),
});
