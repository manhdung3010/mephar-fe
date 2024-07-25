import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup
    .string()
    .max(255, 'Tối đa 255 ký tự')
    .required('Đây là trường bắt buộc!'),
  description: yup.string(),
  // branchId: yup.number(),
});
