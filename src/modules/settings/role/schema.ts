import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.string().required('Đây là trường bắt buộc!'),
  description: yup.string(),
});
