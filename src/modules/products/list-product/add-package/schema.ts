import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  branchId: yup.number(),
  code: yup.string(),
  barCode: yup.string(),
  shortName: yup.string(),
  weight: yup.string(),
  groupProductId: yup.number(),
  imageId: yup.number(),
  imageUrl: yup.string(),
  primePrice: yup.string(),
  price: yup.string().required("Đây là trường bắt buộc!"),
  point: yup.number(),
  expiryPeriod: yup
    .number()
    .test("isRequire", "Đây là trường bắt buộc!", (value, context) => {
      if (context.parent.isBatchExpireControl && !value) return false;
      return true;
    }),
  isDirectSale: yup.boolean(),
  isBatchExpireControl: yup.boolean(),
  registerNumber: yup.string(),
  activeElement: yup.string(),
  content: yup.string(),
  packingSpecification: yup.string(),
  manufactureId: yup.number(),
  countryId: yup.number(),
  inventory: yup
    .number()
    .test("isRequire", "Đây là trường bắt buộc!", (value, context) => {
      if (!context.parent.isBatchExpireControl && !value) return false;
      return true;
    }),
  minInventory: yup.string(),
  maxInventory: yup.string(),
  description: yup.string(),
  note: yup.string(),
  isLoyaltyPoint: yup.boolean().required("Đây là trường bắt buộc!"),
  type: yup.number().required("Đây là trường bắt buộc!"),
  status: yup.number().required("Đây là trường bắt buộc!"),
  baseUnit: yup.string().required("Đây là trường bắt buộc!"),
  productUnits: yup.array(
    yup.object({
      unitName: yup.string().required("Tên đơn vị là trường bắt buộc!"),
      exchangeValue: yup
        .string()
        .required("Giá trị quy đổi là trường bắt buộc!"),
      price: yup.number(),
      code: yup.string(),
      barCode: yup.string(),
      point: yup.string(),
      isDirectSale: yup.boolean().required("Đây là trường bắt buộc!"),
      isBaseUnit: yup.boolean().required("Đây là trường bắt buộc!"),
    })
  ),
  positionId: yup.number(),
});
