import * as yup from "yup";

export const schema = yup.object().shape({
  products: yup.array(
    yup.object({
      productId: yup.number(),
      price: yup.number(),
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
          })
        )
        .test("is-required", "Vui lòng chọn lô sản phẩm", (value, context) => {
          if (context.parent.isBatchExpireControl && !value?.length) {
            return false;
          }
          return true;
        }),
      // .test(
      //   "sum-quantity",
      //   "Số lượng sản phẩm khác với số lượng sản phẩm trong từng lô",
      //   (batches, context) => {
      //     if (!context.parent.isBatchExpireControl) return true;

      //     const totalQuantity = batches?.reduce?.(
      //       (acc, obj) => acc + obj.quantity,
      //       0
      //     );

      //     if (totalQuantity !== context.parent.totalQuantity) return false;

      //     return true;
      //   }
      // ),
    })
  ),
  code: yup.string(),
  description: yup.string(),
  movedBy: yup.number().required("Đây là trường bắt buộc!"),
  toBranchId: yup.number().required("Đây là trường bắt buộc!"),
  fromBranchId: yup.number(),
  receivedBy: yup.number(),
  branchId: yup.number(),
  // groupSupplierId: yup.string().required("Đây là trường bắt buộc!"),
});
export const receiveSchema = yup.object().shape({
  products: yup.array(
    yup.object({
      productId: yup.number(),
      price: yup.number(),
      totalQuantity: yup.number(),
      totalPrice: yup.number(),
      productUnitId: yup.number(),
      isBatchExpireControl: yup.boolean(),
      batches: yup.array(
        yup.object({
          id: yup.number().required("Đây là trường bắt buộc!"),
          quantity: yup.number().required("Đây là trường bắt buộc!"),
          expiryDate: yup.string().required("Đây là trường bắt buộc!"),
        })
      ),
      //   .test("is-required", "Vui lòng chọn lô sản phẩm", (value, context) => {
      //     if (context.parent.isBatchExpireControl && !value?.length)
      //       return false;

      //     return true;
      //   }),
      // .test(
      //   "sum-quantity",
      //   "Số lượng sản phẩm khác với số lượng sản phẩm trong từng lô",
      //   (batches, context) => {
      //     if (!context.parent.isBatchExpireControl) return true;

      //     const totalQuantity = batches?.reduce?.(
      //       (acc, obj) => acc + obj.quantity,
      //       0
      //     );

      //     if (totalQuantity !== context.parent.totalQuantity) return false;

      //     return true;
      //   }
      // ),
    })
  ),
  code: yup.string(),
  description: yup.string(),
  fromBranchId: yup.number(),
  receivedBy: yup.number(),
  branchId: yup.number(),
});
