import * as yup from "yup";

export const schema = yup.object().shape({
  products: yup.array(
    yup.object({
      productId: yup.number(),
      importPrice: yup.number(),
      totalQuantity: yup.number(),
      totalPrice: yup.number(),
      discount: yup.number(),
      productUnitId: yup.number(),
      isBatchExpireControl: yup.boolean(),
      batches: yup
        .array(
          yup.object({
            id: yup.number().required("Đây là trường bắt buộc!"),
            quantity: yup.number().required("Đây là trường bắt buộc!"),
            expiryDate: yup.string().required("Đây là trường bắt buộc!"),
          }),
        )
        .test("is-required", "Vui lòng chọn lô sản phẩm", (value, context) => {
          if (context.parent.isBatchExpireControl && !value?.length) return false;

          return true;
        })
        .test("sum-quantity", "Số lượng sản phẩm khác với số lượng sản phẩm trong từng lô", (batches, context) => {
          if (!context.parent.isBatchExpireControl) return true;

          const totalQuantity = batches?.reduce?.((acc, obj) => acc + obj.quantity, 0);

          if (totalQuantity !== context.parent.totalQuantity) return false;

          return true;
        }),
    }),
  ),
  code: yup.string(),
  paid: yup.string(),
  // .test(
  //   "is-less-than",
  //   "Vui lòng nhập nhỏ hơn hoặc bằng tiền tổng hóa đơn",
  //   (value, context) => {
  //     if (value && value > context.parent.totalPrice) return false;
  //     return true;
  //   }
  // ),
  debt: yup.number(),
  status: yup.string(),
  totalPrice: yup.number(),
  discount: yup.number(),
  description: yup.string(),
  userId: yup.number().required("Đây là trường bắt buộc!"),
  supplierId: yup.string().required("Đây là trường bắt buộc!"),
});
