export enum EOrderMarketStatus {
  PENDING = "pending",
  CONFIRM = "confirm",
  PROCESSING = "processing",
  SEND = "send",
  DONE = "done",
  CANCEL = "cancel",
  CLOSED = "closed",
}

export enum EOrderMarketStatusLabel {
  PENDING = "Chờ xác nhận",
  CONFIRM = "Đã xác nhận",
  PROCESSING = "Đang xử lý",
  SEND = "Đã giao cho ĐVVC",
  DONE = "Hoàn thành",
  CANCEL = "Giao hàng thất bại",
  CLOSED = "Đã hủy",
}

export enum EFollowStoreStatus {
  FALSE = "false",
  CANCEL = "cancel",
  PENDING = "pending",
  ACTIVE = "active",
}
export enum EAcceptFollowStoreStatus {
  CANCEL = "cancel",
  PENDING = "pending",
  ACTIVE = "active",
}
