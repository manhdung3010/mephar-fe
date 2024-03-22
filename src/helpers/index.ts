import dayjs from "dayjs";

export function formatDate(date?: Date | string, format?: string): string {
  return dayjs(date).format(format ?? "DD/MM/YYYY");
}

export function formatDateTime(date?: Date | string, format?: string) {
  return dayjs(date).format(format ?? "DD/MM/YYYY HH:mm:ss");
}

export function getImage(url?: string) {
  return url ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${url}` : "";
}

export function hasMultiplePermission(
  permissions: { model: string; action: string }[],
  models: string[],
  action?: string
) {
  // return permissions?.find((permission) => {
  //   if (action) {
  //     return models.includes(permission.model) && permission.action === action;
  //   }

  //   return models.includes(permission.model);
  // });
  return true;
}

export function hasPermission(
  permissions: { model: string; action: string }[],
  model: string,
  action?: string
) {
  // return permissions?.find((permission) => {
  //   if (action) {
  //     return permission.model === model && permission.action === action;
  //   }

  //   return permission.model === model;
  // });

  return true;
}

export function formatMoney(value?: string | number) {
  return value ? `${value.toLocaleString("en-US")}đ` : "0đ";
}

export function formatNumber(value?: string | number) {
  return Number(value || 0)?.toLocaleString("en-US");
}

export function roundNumber(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function randomString(length = 6) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function cloneObject(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (e) {
    console.log(e, object);
    return object;
  }
}

export function formatBoolean(value: string) {
  if (value === "false") return false;
  if (value === "true") return true;

  return null;
}

export function isVietnamesePhoneNumber(number) {
  // eslint-disable-next-line no-useless-escape
  return /^([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
}

export const getCharByCode = (str: string, position: number) => {
  return String.fromCharCode(str.charCodeAt(0) + position);
};

export const removeAccents = (str: string) => {
  const AccentsMap: any[] = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};
