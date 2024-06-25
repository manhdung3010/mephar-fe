import { roundNumber } from "@/helpers";
import * as yup from "yup";
export const schema = yup.object().shape({
  branchId: yup.number(),
  userCreateId: yup.number().required("Đây là trường bắt buộc!"),
  isBatchExpireControl: yup.boolean(),
  products: yup.array(
    yup.object({
      productUnitId: yup.number(),
      realQuantity: yup.number(),
      batchId: yup.number(),
      inventoryCheckingBatch: yup
        .array(
          yup.object({
            batchId: yup.number(),
            realQuantity: yup.number(),
          })
        )
        // .test(
        //   "sum-quantity",
        //   "Số lượng sản phẩm khác với số lượng sản phẩm trong từng lô",
        //   (batches, context) => {
        //     if (!batches?.length) return true;

        //     const totalQuantity = batches?.reduce?.(
        //       (acc, obj) => acc + (obj?.realQuantity || 0),
        //       0
        //     );

        //     if (roundNumber(totalQuantity || 0) !== context.parent.quantity)
        //       return false;

        //     return true;
        //   }
        // )
        .test(
          "is-required",
          "Vui lòng nhập lô cho sản phẩm",
          (value, context) => {
            if (context.parent.isBatchExpireControl && !value?.length)
              return false;

            return true;
          }
        ),
    })
  ),
  note: yup.string(),
});
