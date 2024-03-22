import ExcelJS from "exceljs";

export const styles = {
  fullBorder: {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  } as ExcelJS.Borders,
  font: {
    name: "Times New Roman",
    family: 4,
  },
  fillCellForm: {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "16dfdfde",
    },
  } as ExcelJS.Fill,
  invisible: {
    color: { argb: "00ffffff" },
  },
  protection: {
    locked: {
      locked: true,
      hidden: true,
    },
    unlocked: {
      locked: false,
      hidden: false,
    },
  },
};

export const formats = {
  number: "#,##0",
  number_1: "#,##0.0",
  number_2: "#,##0.00",
  currency: "#,##0",
  date: "dd/mm/yyyy",
  datetime: "dd/mm/yyyy HH:mm",
};

export const columnFormat = {
  stt: "number",
  "don gia mua": "currency",
  "don gia ban": "currency",
  "so luong": "number",
  "ton kho": "number",
  "so luong ton kho": "number",
  "tong tien mua vao": "currency",
  "tong tien ban ra": "currency",
  "ngay tao": "date",
  "ngay ban": "date",
  "ngay nhap": "date",
  "ngay hoa don": "date",
  "han dung": "date",
  "han su dung": "date",
  "han sd": "date",
  "ngay het han": "date",
  "tong tien": "currency",
  vat: "number",
  vatp: "number",
  "vat(%)": "number",
  "vat (%)": "number",
  "da tra": "currency",
  "da thanh toan": "currency",
  "giam gia": "currency",
  "cong no": "currency",
  "thanh tien": "currency",
  "gia ban chua vat": "currency",
  "gia nhap chua vat": "currency",
  "gia nhap": "currency",
  "gia ban": "currency",
  "thu tien mat": "currency",
  "doanh thu qua chuyen khoan, vi, the,...": "currency",
  "doanh thu ban truc tiep": "currency",
  "doanh thu ban online, cod,...": "currency",
  "doanh thu truoc giam gia": "currency",
  "doanh thu chua cong no": "currency",
  "tong doanh thu": "currency",
  "gia tri": "currency",
  "tong tien hang truoc thue": "currency",
  "tong tien hang sau vat": "currency",
  "tien tra hang ncc": "currency",
  "thuc tra": "currency",
  "tong mua (vnd)": "currency",
  "tong tra (vnd)": "currency",
  "tong mua": "currency",
  "tong tra": "currency",
  "cong no (vnd)": "currency",
  "ti suat loi nhuan(%)": "number",
  "loi nhuan gop": "currency",
  "tong doanh thu thuan": "currency",
  "tong gia tri tra lai": "currency",
  "tong gia von": "currency",
  "so luong khach tra": "number",
  "so luong ban ra": "number",
  "sl dau": "number",
  "sl nhap": "number",
  "sl xuat": "number",
  "sl ton": "number",
  "gia mua": "currency",
  "gia dau": "currency",
  "tong dau": "currency",
  "tong nhap": "currency",
  "gia xuat": "currency",
  "tong xuat": "currency",
  "gia ton": "currency",
  "tong ton": "currency",
  "tra hang": "number",
  "gia ban (*)": "number",

  // format Order
  "gia nhap lan truoc": "number",
  "so luong ncc": "number",
  "gia ncc": "number",

  //format cashbook
  "ngay thang ghi so": "date",
  "ngay thang chung tu": "date",
  thu: "currency",
  chi: "currency",
  ton: "currency",
  "so tien": "currency",
};

export const columnWidth = {
  stt: 10,
  "ma thuoc": 14,
  "ma san pham": 14,
  "ma mat hang": 14,
  barcode: 17,
  "ma vach": 17,
  "ten thuoc": 40,
  "ten mat hang": 40,
  "ten san pham": 40,
  "so lo": 14,
  "lo sx": 14,
  "lo san xuat": 14,
  "don vi tinh": 10.5,
  "don vi": 10.5,
  "don gia mua": 11,
  "don gia ban": 11,
  "so luong ton kho": 15,
  "ton kho": 14.5,
  "tong tien mua vao": 16.5,
  "tong tien ban ra": 15,
  "ma hoa don": 11,
  "ma hd": 11,
  "ma hd nhap hang": 17,
  "ma hd ban hang": 17,
  "khach hang": 22,
  "duoc si ban": 20,
  "tong tien": 12,
  "thanh tien": 12,
  vat: 12,
  vatp: 10,
  "giam gia": 12,
  "da tra": 12,
  "da thanh toan": 15,
  "cong no": 12,
  "ngay thang": 13,
  "ngay ban": 12.5,
  "ngay nhap": 12.5,
  "ngay mua": 12.5,
  "ngay hoa don": 14,
  "ngay het han": 14,
  "ngay tra hang": 16.5,
  "han su dung": 14,
  "han sd": 12.5,
  "han dung": 12.5,
  "tong gia tri": 11,
  "so dien thoai": 15.5,
  "dien thoai": 12.5,
  "nha cung cap": 20,
  "ma phieu": 10,
  "ngay tao": 17.5,
  "loai thu/chi": 20,
  "nguoi tao phieu": 20,
  "gia tri": 20,
  "ghi chu": 20,
  "trang thai": 20,
  "ten nhom thuoc": 40,
  "ten nhom san pham": 40,
  "ten danh muc thuoc": 40,
  "ten danh muc san pham": 40,
  "so loai thuoc": 20,
  "don vi nho nhat": 20,
  "ton kho( don vi nho nhat)": 25,
  "ten ncc": 30,
  "tong mua (vnd)": 15,
  "tong tra (vnd)": 15,
  "tong mua": 15,
  "tong tra": 15,
  "cong no (vnd)": 15,
  "ma so thue": 20,
  sdt: 15,
  "so dt": 15,
  email: 15,
  "dia chi": 20,
  "ten khach hang": 15,
  "nguoi tao": 15,
  "ti suat loi nhuan(%)": 15,
  "loi nhuan gop": 13,
  "tong doanh thu thuan": 15,
  "tong gia tri tra lai": 15,
  "tong gia von": 13,
  "gia nhap chua vat": 15,
  "so luong khach tra": 15,
  "so luong ban ra": 14,
  "tong dau": 12,
  "tong nhap": 12,
  "tong xuat": 12,
  "tong ton": 12,
  "gia ban chua vat": 16.8,
  "loai hd": 25,
  "so luong canh bao toi thieu": 24,
  "gia nhap lan truoc": 20,
  "so luong ncc": 16,
  "gia ncc": 14,
  "hoat chat": 28,
  "ten thuoc (*)": 40,
  "don vi tinh (*)": 10.5,
  "ten hang": 40,
  "quy cach dong goi": 28,
  "hang sx": 20,
  "id anh": 30,
  "ngay thang ghi so": 18,
  "ngay thang chung tu": 18,
  "dien giai": 22,
  thu: 15,
  chi: 15,
  ton: 15,
  "loai thuoc": 18,
  "sale ban hang": 18,
};
