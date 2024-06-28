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
  return permissions?.find((permission) => {
    if (action) {
      return models.includes(permission.model) && permission.action === action;
    }

    return models.includes(permission.model);
  });
  // return true;
}

export function hasPermission(
  permissions: { model: string; action: string }[],
  model: string,
  action?: string
) {
  return permissions?.find((permission) => {
    if (action) {
      return permission.model === model && permission.action === action;
    }

    return permission.model === model;
  });

  // return true;
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

export const convertMoneyToString = (amount: number) => {
  // Mảng các chữ số
  var units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
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
