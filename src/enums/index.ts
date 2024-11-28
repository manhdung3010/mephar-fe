export function getEnumKeyByValue(enumValue, value) {
  return Object.keys(enumValue).find((key) => enumValue[key] === value) || "";
}

export enum EStorageKey {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  PRODUCT_RETURN_STATE = "PRODUCT_RETURN_STATE",
  PRODUCT_IMPORT_STATE = "PRODUCT_IMPORT_STATE",
  PRODUCT_MOVE_STATE = "PRODUCT_MOVE_STATE",
  ORDER_ACTIVE_STATE = "ORDER_ACTIVE_STATE",
  CHECK_INVENTORY_STATE = "CHECK_INVENTORY_STATE",
  MARKET_ORDER_STATE = "MARKET_ORDER_STATE",
  PRODUCT_RECEIVE_STATE = "PRODUCT_RECEIVE_STATE",
  MARKET_CART_STATE = "MARKET_CART_STATE",
  DISCOUNT_STATE = "DISCOUNT_STATE",
}

export enum EProductStatus {
  active = 1,
  inactive = 0,
}

export enum EProductStatusLabel {
  active = "Đang kinh doanh",
  inactive = "Ngưng kinh doanh",
}

export enum EImportProductStatus {
  DRAFT = "DRAFT", // Lưu tạm
  SUCCEED = "SUCCEED", // Hoàn thành
}

export enum EImportProductStatusLabel {
  DRAFT = "Lưu tạm", // Lưu tạm
  SUCCEED = "Hoàn thành", // Hoàn thành
}

export enum EBillStatus {
  comleted = "comleted",
  CONNECTED = "CONNECTED",
}

export enum EBillStatusLabel {
  comleted = "Đã hoàn thành",
  CONNECTED = "Đã liên thông",
}

export enum EOrderStatus {
  PENDING = "PENDING", // Đang chờ duyệt / Duyệt
  CONFIRMING = "CONFIRMING", // Đang xác nhận / Xác nhận
  SHIPPING = "SHIPPING", // Đang vận chuyển/ Vận chuyển
  DELIVERING = "DELIVERING", // Đang giao hàng/Giao hàng
  PAID = "PAID", // Đã thanh toán
  CANCELLED = "CANCELLED", // Hủy đơn
  SUCCEED = "SUCCEED", // Đơn hàng thành công
}

export enum EOrderStatusLabel {
  PENDING = "Đang chờ duyệt", // Đang chờ duyệt / Duyệt
  CONFIRMING = "Đang xác nhận", // Đang xác nhận / Xác nhận
  SHIPPING = "Đang vận chuyển", // Đang vận chuyển/ Vận chuyển
  DELIVERING = "Đang giao hàng", // Đang giao hàng/Giao hàng
  PAID = "Đã thanh toán", // Đã thanh toán
  CANCELLED = "Hủy đơn", // Hủy đơn
  SUCCEED = "Đơn hàng thành công", // Đơn hàng thành công
}

export enum EReturnTransactionStatus {
  comleted = "comleted",
}

export enum EDeliveryTransactionStatus {
  MOVING = "MOVING",
  RECEIVED = "RECEIVED",
}

export enum EDeliveryTransactionStatusLabel {
  MOVING = "Đang vận chuyển",
  RECEIVED = "Đã nhận",
}

export enum EReturnTransactionStatusLabel {
  comleted = "Đã hoàn thành",
}

export enum EProductSettingStatus {
  active = "active",
  inactive = "inactive",
}

export enum EProductSettingStatusLabel {
  active = "Đang bán",
  inactive = "Ngừng bán",
}

export enum EPaymentMethod {
  CASH = "CASH",
  BANKING = "BANK",
  DEBT = "DEBT",
}

export enum ECustomerStatus {
  active = "active",
  inactive = "inactive",
  potential = "potential",
}

export enum ECustomerStatusLabel {
  active = "Hoạt động",
  inactive = "Ngưng hoạt động",
  potential = "Tiềm năng",
}

export enum EDoctorStatus {
  active = 1,
  inactive = 0,
}

export enum EDoctorStatusLabel {
  active = "Hoạt động",
  inactive = "Ngưng hoạt động",
}

export enum EBranchStatus {
  active = "active",
  inactive = "inactive",
}

export enum EBranchStatusLabel {
  active = "Đang hoạt động",
  inactive = "Ngưng hoạt động",
}

export enum EEmployeeStatus {
  active = "active",
  inactive = "inactive",
}

export enum EEmployeeStatusLabel {
  active = "Đang hoạt động",
  inactive = "Ngưng hoạt động",
}

export enum EDiscountStatus {
  active = "active",
  inactive = "inactive",
}

export enum EDiscountStatusLabel {
  active = "Kích hoạt",
  inactive = "Ngưng hoạt động",
}

export enum EGender {
  male = "male",
  female = "female",
}

export enum EGenderLabel {
  male = "Nam",
  female = "Nữ",
}

export enum ECustomerType {
  PERSONAL = 1,
  COMPANY = 2,
}

export enum ECommonStatus {
  active = 1,
  inactive = 0,
}

export enum ECommonStatusLabel {
  active = "Hoạt động",
  inactive = "Ngưng hoạt động",
}

export enum EUserPositions {
  admin = "admin",
  management = "management",
  staff = "staff",
}

export enum EUserPositionsLabel {
  admin = "Admin",
  management = "Quản lý",
  staff = "Nhân viên",
}

export enum EProductType {
  MEDICINE = 1,
  PACKAGE = 2,
  COMBO = 3,
}

export enum EProductTypeLabel {
  MEDICINE = "Thuốc",
  PACKAGE = "Hàng hóa",
  COMBO = "Combo - đóng gói",
}

export enum EDiscountType {
  PERCENT = 1,
  MONEY = 2,
}

export enum EDiscountLabel {
  PERCENT = "%",
  MONEY = "đ",
}

export enum EReturnProductStatus {
  DRAFT = "DRAFT", // Lưu tạm
  SUCCEED = "SUCCEED", // Hoàn thành
  CANCELLED = "CANCELLED", // Hủy bỏ
}

export enum EReturnProductStatusLabel {
  DRAFT = "Lưu tạm", // Lưu tạm
  SUCCEED = "Hoàn thành", // Hoàn thành
  CANCELLED = "Hủy bỏ", // Hủy bỏ
}

export enum EConnectSystemStatus {
  CONNECTED = 1,
  DISCONNECTED = 0,
}

export enum EConnectSystemStatusLabel {
  CONNECTED = "Đã kết nối",
  DISCONNECTED = "Chưa kết nối",
}

export enum ESaleReportConcerns {
  TIME = "TIME",
  REVENUE = "REVENUE",
  DISCOUNT = "DISCOUNT",
  SALE_RETURN = "SALE_RETURN",
  EMPLOYEE = "EMPLOYEE",
}
export const saleReportLabels: Record<any, string> = {
  [ESaleReportConcerns.TIME]: "Thời gian",
  [ESaleReportConcerns.REVENUE]: "Lợi nhuận",
};
export enum EProductReportConcerns {
  SALE = "SALE",
  REVENUE = "REVENUE",
  WAREHOUSE_VALUE = "WAREHOUSE_VALUE",
  INVENTORY = "INVENTORY",
  INVENTORY_DETAIL = "INVENTORY_DETAIL",
  CANCEL = "CANCEL",
  EMPLOYEE = "EMPLOYEE",
  CUSTOMER = "CUSTOMER",
}
export const productReportLabels: Record<EProductReportConcerns, string> = {
  [EProductReportConcerns.SALE]: "Bán hàng",
  [EProductReportConcerns.REVENUE]: "Lợi nhuận",
  [EProductReportConcerns.WAREHOUSE_VALUE]: "Giá trị kho",
  [EProductReportConcerns.INVENTORY]: "Xuất nhập tồn",
  [EProductReportConcerns.INVENTORY_DETAIL]: "Xuất nhập tồn chi tiết",
  [EProductReportConcerns.CANCEL]: "Xuất hủy",
  [EProductReportConcerns.EMPLOYEE]: "Nhân viên theo hàng bán",
  [EProductReportConcerns.CUSTOMER]: "Khách theo hàng bán",
};

export const saleReturn = [
  {
    key: "DRAFT",
    value: "Lưu tạm",
  },
  {
    key: "SUCCEED",
    value: "Hoàn thành",
  },
  {
    key: "CANCELLED",
    value: "Hủy bỏ",
  },
];
