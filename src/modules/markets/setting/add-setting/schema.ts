import * as yup from "yup";

export const schema = yup.object().shape({
  productId: yup.string().required("Đây là trường bắt buộc!"),
  quantity: yup.number().required("Đây là trường bắt buộc!"),
  marketType: yup.string().required("Đây là trường bắt buộc!"),
  productUnitId: yup.string().required("Đây là trường bắt buộc!"),
  price: yup
    .number()
    .required("Đây là trường bắt buộc!")
    .test("price", "Giá bán phải lớn hơn 0", (value) => value > 0),
  discountPrice: yup.number(),
  description: yup.string(),
  thumbnail: yup.string().required("Đây là trường bắt buộc!"),
  images: yup.array(),
  batches: yup.array(),
});
