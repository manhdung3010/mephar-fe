import * as yup from "yup";
export const schema = yup.object().shape({
  addressId: yup.number(),
  userCreateId: yup.number().required("Đây là trường bắt buộc!"),
  listProduct: yup.array().of(
    yup.object({
      marketProductId: yup.number(),
      quantity: yup.number(),
      price: yup.number(),
    }),
  ),
  customerId: yup.number().required("Đây là trường bắt buộc!"),
  note: yup.string(),
});
