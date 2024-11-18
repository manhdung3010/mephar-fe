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
  discountPrice: yup
    .number()
    .test("discountPrice", "Giá khuyến mại không được lớn hơn hoặc bằng giá gốc", function (value) {
      if (!value) return true;
      return value < this.parent.price;
    }),
  description: yup.string(),
  thumbnail: yup.string(),
  images: yup.array(),
  batches: yup.array(),
  isDefaultPrice: yup.boolean(),
});
