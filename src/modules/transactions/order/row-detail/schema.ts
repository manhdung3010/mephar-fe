import * as yup from "yup";

export const schema = yup.object().shape({
  status: yup.string(),
  products: yup.array().of(
    yup.object().shape({
      marketProductId: yup.string(),
      marketOrderProductId: yup.string(),
      listSeri: yup.array(),
    })
  ),
});
