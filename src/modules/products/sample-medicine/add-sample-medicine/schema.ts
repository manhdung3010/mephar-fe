import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Đây là trường bắt buộc!"),
  branchId: yup.number(),
  code: yup.string(),
  description: yup.string(),
  weight: yup.string(),
  status: yup.number().required("Đây là trường bắt buộc!"),
  imageId: yup.string(),
  positionId: yup.string(),
  ingredientProducts: yup.array(
    yup.object({
      dosage: yup.string(),
      productUnitId: yup.number().required("Đây là trường bắt buộc!"),
      productId: yup.number().required("Đây là trường bắt buộc!"),
      quantity: yup.number().required("Đây là trường bắt buộc!"),
    })
  ),
});
