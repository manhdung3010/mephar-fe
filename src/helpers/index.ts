import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Sử dụng plugin
dayjs.extend(customParseFormat);

/**
 * Formats a given date into a specified string format.
 *
 * @param date - The date to format. Can be a Date object or a string.
 * @param format - The format string to use. Defaults to "DD/MM/YYYY" if not provided.
 * @returns The formatted date string.
 */
export function formatDate(date?: Date | string, format?: string): string {
  return dayjs(date).format(format ?? "DD/MM/YYYY");
}

export function formatDateTime(date?: Date | string, format?: string) {
  return dayjs(date).format(format ?? "DD/MM/YYYY HH:mm:ss");
}

/**
 * Constructs a full image URL based on the provided relative URL.
 *
 * @param url - The relative URL of the image. If not provided, an empty string is returned.
 * @returns The full URL of the image if the relative URL is provided; otherwise, an empty string.
 */
export function getImage(url?: string) {
  return url ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${url}` : "";
}

/**
 * Checks if there are multiple permissions that match the given models and optional action.
 *
 * @param permissions - An array of permission objects, each containing a model and an action.
 * @param models - An array of model names to check against the permissions.
 * @param action - (Optional) The action to check against the permissions.
 * @returns A boolean indicating whether there are matching permissions.
 */
export function hasMultiplePermission(
  permissions: { model: string; action: string }[],
  models: string[],
  action?: string,
) {
  return permissions?.find((permission) => {
    if (action) {
      return models.includes(permission.model) && permission.action === action;
    }

    return models.includes(permission.model);
  });
}

/**
 * Checks if a given set of permissions includes a specific model and optionally an action.
 *
 * @param permissions - An array of permission objects, each containing a model and an action.
 * @param model - The model to check for in the permissions.
 * @param action - (Optional) The action to check for in the permissions.
 * @returns A boolean indicating whether the specified model and action (if provided) exist in the permissions.
 */
export function hasPermission(permissions: { model: string; action: string }[], model: string, action?: string) {
  return permissions?.find((permission) => {
    if (action) {
      return permission.model === model && permission.action === action;
    }

    return permission.model === model;
  });
}

/**
 * Formats a given value as a string representing money in Vietnamese Dong (VND).
 *
 * @param value - The value to be formatted, which can be a string or a number.
 *                If the value is undefined or null, it defaults to 0.
 * @returns A string representing the formatted money value in VND,
 *          with commas as thousand separators and "đ" as the currency symbol.
 */
export function formatMoney(value?: string | number) {
  return value ? `${Number(value || 0).toLocaleString("en-US")}đ` : "0đ";
}

/**
 * Formats a given number or string to a locale-specific string representation.
 *
 * @param value - The number or string to format. If the value is undefined, it defaults to 0.
 * @returns The formatted string representation of the number in "en-US" locale.
 */
export function formatNumber(value?: string | number) {
  return Number(value || 0)?.toLocaleString("en-US");
}

/**
 * Rounds a number to three decimal places.
 *
 * @param value - The number to be rounded.
 * @returns The number rounded to three decimal places.
 */
export function roundNumber(value: number) {
  return Math.round(value * 1000) / 1000;
}

/**
 * Generates a random string of a specified length.
 *
 * @param {number} [length=6] - The length of the random string to generate. Defaults to 6 if not provided.
 * @returns {string} A random string consisting of uppercase and lowercase letters and digits.
 */
export function randomString(length = 6) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

/**
 * Clones an object by serializing it to JSON and then parsing it back.
 * This method creates a deep copy of the object.
 *
 * @param object - The object to be cloned.
 * @returns A deep copy of the provided object. If an error occurs during cloning, the original object is returned.
 */
export function cloneObject(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (e) {
    console.log(e, object);
    return object;
  }
}

/**
 * Converts a string representation of a boolean to its corresponding boolean value.
 *
 * @param value - The string to be converted. Expected values are "true" or "false".
 * @returns `true` if the input is "true", `false` if the input is "false", or `null` if the input is neither.
 */
export function formatBoolean(value: string) {
  if (value === "false") return false;
  if (value === "true") return true;

  return null;
}

/**
 * Checks if the given phone number is a valid Vietnamese phone number.
 *
 * A valid Vietnamese phone number starts with +84, 84, or 0 followed by
 * one of the digits 3, 5, 7, 8, 9, or 1 (with sub-ranges 2, 6, 8, 9),
 * and then contains 8 more digits.
 *
 * @param number - The phone number to validate.
 * @returns `true` if the phone number is valid, `false` otherwise.
 */
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

export const convertMoneyToString = (amount: number) => {
  // Mảng các chữ số
  var units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  // Mảng các đơn vị
  var places = ["", "nghìn", "triệu", "tỷ"];

  // Hàm đọc ba chữ số
  function docBaChuSo(num) {
    var hundred = Math.floor(num / 100);
    var ten = Math.floor((num % 100) / 10);
    var unit = num % 10;
    var result = "";
    if (hundred > 0) {
      result += units[hundred] + " trăm ";
    }
    if (ten === 0 && unit === 0 && hundred > 0) {
      result += "linh ";
    } else if (ten === 0 && unit > 0) {
      result += "lẻ ";
    } else if (ten === 1) {
      result += "mười ";
    } else if (ten > 1) {
      result += units[ten] + " mươi ";
    }
    if (unit === 1 && ten !== 0 && ten !== 1) {
      result += "mốt ";
    } else if (unit === 5 && (ten !== 0 || hundred !== 0)) {
      result += "lăm ";
    } else if (unit > 0) {
      result += units[unit] + " ";
    }
    return result;
  }

  var readAmount = "";
  var money = Math.abs(amount);
  var placeIndex = 0;
  while (money > 0) {
    var chunk = money % 1000;
    if (chunk > 0) {
      readAmount = docBaChuSo(chunk) + places[placeIndex] + " " + readAmount;
    }
    money = Math.floor(money / 1000);
    placeIndex++;
  }
  if (amount < 0) {
    readAmount = "Âm " + readAmount;
  }
  return readAmount.trim();
};

/**
 * Converts a number to its Vietnamese textual representation.
 *
 * @param number - The number to be converted.
 * @returns The Vietnamese textual representation of the number.
 *
 * @example
 * ```typescript
 * const result = to_vietnamese(123);
 * console.log(result); // "một trăm hai mươi ba"
 * ```
 */
export const to_vietnamese = (number) => {
  const defaultNumbers = " hai ba bốn năm sáu bảy tám chín";

  const chuHangDonVi = ("1 một" + defaultNumbers).split(" ");
  const chuHangChuc = ("lẻ mười" + defaultNumbers).split(" ");
  const chuHangTram = ("không một" + defaultNumbers).split(" ");

  function convert_block_three(number): any {
    if (number == "000") return "";
    let _a: any = number + ""; //Convert biến 'number' thành kiểu string

    //Kiểm tra độ dài của khối
    switch (_a.length) {
      case 0:
        return "";
      case 1:
        return chuHangDonVi[_a];
      case 2:
        return convert_block_two(_a);
      case 3:
        let chuc_dv = "";
        if (_a.slice(1, 3) != "00") {
          chuc_dv = convert_block_two(_a.slice(1, 3));
        }
        let tram = chuHangTram[_a[0]] + " trăm";
        return tram + " " + chuc_dv;
    }
  }

  function convert_block_two(number) {
    let dv = chuHangDonVi[number[1]];
    let chuc = chuHangChuc[number[0]];
    let append = "";

    // Nếu chữ số hàng đơn vị là 5
    if (number[0] > 0 && number[1] == 5) {
      dv = "lăm";
    }

    // Nếu số hàng chục lớn hơn 1
    if (number[0] > 1) {
      append = " mươi";

      if (number[1] == 1) {
        dv = " mốt";
      }
    }

    return chuc + "" + append + " " + dv;
  }

  const dvBlock: any = "1 nghìn triệu tỷ".split(" ");

  let str = parseInt(number) + "";
  let i = 0;
  let arr: any = [];
  let index = str.length;
  let result: any = [];
  let rsString = "";

  if (index == 0 || str == "NaN") {
    return "";
  }

  // Chia chuỗi số thành một mảng từng khối có 3 chữ số
  while (index >= 0) {
    arr.push(str.substring(index, Math.max(index - 3, 0)));
    index -= 3;
  }

  // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != "" && arr[i] != "000") {
      result.push(convert_block_three(arr[i]));

      // Thêm đuôi của mỗi khối
      if (dvBlock[i]) {
        result.push(dvBlock[i]);
      }
    }
  }

  // Join mảng kết quả lại thành chuỗi string
  rsString = result.join(" ");

  // Trả về kết quả kèm xóa những ký tự thừa
  return rsString.replace(/[0-9]/g, "").replace(/ /g, " ").replace(/ $/, "");
};
/**
 * Calculates the time elapsed since a given date and returns it as a human-readable string.
 *
 * @param dateString - The date string to calculate the time elapsed from. The string should be in a format that can be converted to ISO 8601.
 * @returns A string representing the time elapsed since the given date in Vietnamese.
 *
 * @example
 * ```typescript
 * const result = timeAgo("2022-01-01 12:00:00");
 * console.log(result); // "x tháng trước" or "x ngày trước" etc.
 * ```
 */
export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString.replace(" ", "T")); // Chuyển đổi định dạng thành ISO 8601
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + " năm trước";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " tháng trước";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " ngày trước";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " tiếng trước";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " phút trước";
  }
  return Math.floor(seconds) + " giây trước";
};

/**
 * Converts a distance from meters to kilometers and formats it to one decimal place.
 *
 * @param distance - The distance in meters to be converted.
 * @returns A string representing the distance in kilometers followed by 'km'.
 */
export const formatDistance = (distance: number) => {
  // Chuyển đổi khoảng cách từ mét sang kilômét và làm tròn đến 1 chữ số sau dấu phẩy
  const kilometers = (distance / 1000).toFixed(1);

  // Trả về chuỗi định dạng với đơn vị 'km'
  return `${kilometers}km`;
};

export const sliceString = (str: string, maxLength: number) => {
  return str?.length > maxLength ? str?.slice(0, maxLength) + "..." : str;
};

/**
 * Checks if the input string is in the format of "number, number".
 *
 * @param input - The string to be checked.
 * @returns `true` if the input string matches the coordinates format, otherwise `false`.
 */
export const isCoordinates = (input) => {
  // Kiểm tra xem chuỗi có dạng "số, số" hay không
  const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  return regex.test(input.trim());
};

// market - check end price
export const checkEndPrice = (discountPrice, price) => {
  return discountPrice > 0 ? discountPrice : price;
};
