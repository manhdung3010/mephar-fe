export const checkTypeOrder = (code: string) => {
  // ex code: 'MK00000123' or 'DH00000123'
  const type = code?.slice(0, 2);
  return type === "MK" ? true : false;
};
