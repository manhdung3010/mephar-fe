import * as yup from "yup";

export const schema = yup.object().shape({
  code: yup.string(),
  name: yup.string().required("Đây là trường bắt buộc!"),
  status: yup.string(),
  note: yup.string(),
  target: yup.string(),
  type: yup.string(),
  conditions: yup.array(),
  branchOp: yup.number(),
  groupCustomerOp: yup.number(),
  isMultiple: yup.boolean(),
  items: yup.array(
    yup.object({
      id: yup.number(),
      condition: yup.object({
        order: yup.object({
          from: yup
            .number()
            .required("Đây là trường bắt buộc!")
            .test("check-value-from", "Giá trị phải lớn hơn 0", (value) => value > 0),
        }),
        product: yup.object({
          type: yup.string(),
          from: yup.number().when("type", ([type], schema) => {
            if (type === "PRODUCT_PRICE" || type === "GIFT" || type === "LOYALTY") {
              return schema
                .required("Đây là trường bắt buộc!")
                .test("check-value-discount", "Giá trị phải lớn hơn 0", (value) => value > 0);
            }
            return schema.notRequired();
          }),
        }),
      }),
      apply: yup.object({
        discountValue: yup.number().when("type", ([type], schema) => {
          if (type === "PRICE_BY_BUY_NUMBER") {
            return schema.notRequired();
          }
          return schema
            .required("Đây là trường bắt buộc!")
            .test("check-value-discount", "Giá trị phải lớn hơn 0", (value) => value > 0);
        }),
        discountType: yup.string(),
        productUnitId: yup.array().when(["type", "groupId"], ([type, groupId], schema) => {
          if ((type === "PRODUCT_PRICE" || type === "GIFT") && !groupId) {
            return schema.required("Đây là trường bắt buộc!");
          }
          return schema.notRequired();
        }),
        groupId: yup.array(),
        maxQuantity: yup.number().when("type", ([type], schema) => {
          if (type === "PRODUCT_PRICE" || type === "GIFT") {
            return schema
              .required("Đây là trường bắt buộc!")
              .test("check-value-discount", "Giá trị phải lớn hơn 0", (value) => value > 0);
          }
          return schema.notRequired();
        }),
        isGift: yup.boolean(),
        pointValue: yup.number().when("type", ([type], schema) => {
          if (type === "LOYALTY") {
            return schema
              .required("Đây là trường bắt buộc!")
              .test("check-value-discount", "Giá trị phải lớn hơn 0", (value) => value > 0);
          }
          return schema.notRequired();
        }),
        pointType: yup.string(),
        type: yup.string(),
      }),
      childItems: yup.array(),
    }),
  ),

  time: yup.object({
    dateFrom: yup.string().required("Đây là trường bắt buộc!"),
    dateTo: yup.string().required("Đây là trường bắt buộc!"),
    byDay: yup.array(),
    byMonth: yup.array(),
    byHour: yup.array(),
    byWeekDay: yup.array(),
    isWarning: yup.boolean(),
    isBirthday: yup.boolean(),
  }),
  scope: yup.object({
    customer: yup.object(),
    branch: yup.object(),
    channel: yup.object(),
  }),
});
export const productSchema = yup.object().shape({
  code: yup.string(),
  name: yup.string().required("Đây là trường bắt buộc!"),
  status: yup.string(),
  note: yup.string(),
  target: yup.string(),
  type: yup.string(),
  conditions: yup.array(),
  branchOp: yup.number(),
  groupCustomerOp: yup.number(),
  items: yup.array(
    yup.object({
      condition: yup.object({
        product: yup.object({
          from: yup
            .number()
            .required("Đây là trường bắt buộc!")
            .test("check-value-from", "Giá trị phải lớn hơn 0", (value) => value > 0),
        }),
        productUnitId: yup.array(),
      }),
      apply: yup.object({
        discountValue: yup
          .number()
          .required("Đây là trường bắt buộc!")
          .test("check-value-discount", "Giá trị phải lớn hơn 0", (value) => value > 0),
        discountType: yup.string(),
        productUnitId: yup.array(),
        maxQuantity: yup.number(),
      }),
    }),
  ),

  time: yup.object({
    dateFrom: yup.string().required("Đây là trường bắt buộc!"),
    dateTo: yup.string().required("Đây là trường bắt buộc!"),
    byDay: yup.array(),
    byMonth: yup.array(),
    byHour: yup.array(),
    byWeekDay: yup.array(),
    isWarning: yup.boolean(),
    isBirthday: yup.boolean(),
  }),
  scope: yup.object({
    customer: yup.object(),
    branch: yup.object(),
  }),
});
