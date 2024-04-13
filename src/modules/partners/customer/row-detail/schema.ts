import { de } from "@faker-js/faker";
import * as yup from "yup";

export const schema = yup.object().shape({
  totalAmount: yup.number(),
  amount: yup.number().required("Đây là trường bắt buộc!"),
  debt: yup.number(),
  paymentMethod: yup.string(),
  // description: yup.string(),
  // movedBy: yup.number().required("Đây là trường bắt buộc!"),
  // toBranchId: yup.number().required("Đây là trường bắt buộc!"),
  // fromBranchId: yup.number(),
  // receivedBy: yup.number(),
  // branchId: yup.number(),
});
