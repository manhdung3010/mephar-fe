import * as yup from "yup";

export const schema = yup.object().shape({
  type: yup.string(),
  isConvertDefault: yup.boolean(),
  convertMoneyBuy: yup.number(),
  // .test("check-value-1", "Giá trị phải > 0", (value: any) => value > 0),
  isPointPayment: yup.boolean(),
  convertMoneyPayment: yup.number(),
  // .test("check-value-2", "Giá trị phải > 0", (value: any) => value > 0),
  convertPoint: yup.number(),
  // .test("check-value-3", "Giá trị phải > 0", (value: any) => value > 0),
  afterByTime: yup.number(),
  isDiscountProduct: yup.boolean(),
  isDiscountOrder: yup.boolean(),
  isPointBuy: yup.boolean(),
  isAllCustomer: yup.boolean(),
  groupCustomers: yup.array(),
  status: yup.string(),
});
