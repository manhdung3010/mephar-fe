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
  items: yup.array(
    yup.object({
      condition: yup.object({
        order: yup.object({
          from: yup.number().required("Đây là trường bắt buộc!"),
        }),
      }),
      apply: yup.object({
        discountValue: yup.number().required("Đây là trường bắt buộc!"),
        discountType: yup.string(),
      }),
    })
  ),

  time: yup.object({
    dateFrom: yup.string(),
    dateTo: yup.string(),
    byDay: yup.array(),
    byMonth: yup.array(),
    byHour: yup.array(),
    byWeekDay: yup.array(),
    isWarning: yup.boolean(),
    isBirthDay: yup.boolean(),
  }),
  scope: yup.object({
    customer: yup.object(),
    branch: yup.object(),
  }),
});
