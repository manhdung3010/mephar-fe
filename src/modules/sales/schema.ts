import * as yup from "yup";

import { regexPhoneNumber } from "@/constants";
import { EPaymentMethod } from "@/enums";
import { roundNumber } from "@/helpers";

export const schema = yup.object().shape({
  products: yup.array(
    yup.object({
      productId: yup.number().required("Đây là trường bắt buộc!"),
      productUnitId: yup.number().required("Đây là trường bắt buộc!"),
      originProductUnitId: yup.number().required("Đây là trường bắt buộc!"),
      productType: yup.number().required("Đây là trường bắt buộc!"),
      quantity: yup.number().required("Đây là trường bắt buộc!"),
      isBatchExpireControl: yup.boolean(),
      batches: yup
        .array(
          yup.object({
            id: yup.number(),
            quantity: yup
              .number()
              .test(
                "check-quantity",
                "Số lượng sản phẩm chọn phải nhỏ hơn hoặc bằng số lượng tồn",
                (value, context) => {
                  if (Number(value || 0) > context.parent.inventory) {
                    return false;
                  }

                  return true;
                },
              ),
            inventory: yup.number(),
          }),
        )
        .test("sum-quantity", "Số lượng sản phẩm khác với số lượng sản phẩm trong từng lô", (batches, context) => {
          if (!batches?.length) return true;

          const totalQuantity = batches?.reduce?.((acc, obj) => acc + (obj?.quantity || 0), 0);

          if (roundNumber(totalQuantity || 0) !== context.parent.quantity) return false;

          return true;
        })
        .test("is-required", "Vui lòng nhập lô cho sản phẩm", (value, context) => {
          if (context.parent.isBatchExpireControl && !value?.length) return false;

          return true;
        }),
    }),
  ),
  totalPrice: yup.number().required("Đây là trường bắt buộc!"),
  discount: yup.number(),
  discountType: yup.number(),
  paymentPoint: yup.number(),
  cashOfCustomer: yup.string().test("isRequire", "Đây là trường bắt buộc!", (value, context) => {
    if (context.parent.paymentType === EPaymentMethod.CASH && !value?.length) return false;
    return true;
  }),
  paymentType: yup.string().required("Đây là trường bắt buộc!"),
  description: yup.string(),
  userId: yup.number().required("Đây là trường bắt buộc!"),
  customerId: yup.number(),
  branchId: yup.number(),
  prescriptionId: yup.number(),
});
export const schemaReturn = yup.object().shape({
  products: yup.array(
    yup.object({
      productId: yup.number().required("Đây là trường bắt buộc!"),
      productUnitId: yup.number().required("Đây là trường bắt buộc!"),
      // productType: yup.number().required("Đây là trường bắt buộc!"),
      quantity: yup.number().required("Đây là trường bắt buộc!"),
      quantityValidate: yup.number(),
      // returnPrice: yup.number().required("Đây là trường bắt buộc!"),
    }),
  ),
  paymentType: yup.string().required("Đây là trường bắt buộc!"),
  paid: yup.number().required("Đây là trường bắt buộc!"),
  discount: yup.number(),
  returnFee: yup.number(),
  description: yup.string(),
  userId: yup.number().required("Đây là trường bắt buộc!"),
  customerId: yup.number(),
  branchId: yup.number(),
});

export const prescriptionSchema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  code: yup.string(),
  branchId: yup.number(),
  doctorId: yup.number(),
  gender: yup.string(),
  age: yup.string(),
  weight: yup.string(),
  identificationCard: yup.mixed().test("is-number", "CMTND/CCCD phải là số", function (value: any) {
    // Nếu giá trị là null hoặc undefined, trả về luôn là true (không có lỗi)
    if (value === null || value === undefined) {
      return true;
    }
    // Kiểm tra xem giá trị có phải là một số không
    return !isNaN(value);
  }),
  healthInsuranceCard: yup.string(),
  address: yup.string(),
  supervisor: yup.string(),
  phone: yup.string().nullable().matches(regexPhoneNumber, "Vui lòng nhập đúng định dạng số điện thoại"),
  diagnostic: yup.string(),
  healthFacilityId: yup.number(),
});
