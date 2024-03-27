import { EOrderStatus, EOrderStatusLabel } from "@/enums";

export const billStatusData = [
  {
    value: EOrderStatus.SUCCEED,
    label: EOrderStatusLabel.SUCCEED,
  },
  {
    value: EOrderStatus.CONFIRMING,
    label: EOrderStatusLabel.CONFIRMING,
  },
  {
    value: EOrderStatus.SHIPPING,
    label: EOrderStatusLabel.SHIPPING,
  },
  {
    value: EOrderStatus.DELIVERING,
    label: EOrderStatusLabel.DELIVERING,
  },
  {
    value: EOrderStatus.PAID,
    label: EOrderStatusLabel.PAID,
  },
  {
    value: EOrderStatus.CANCELLED,
    label: EOrderStatusLabel.CANCELLED,
  },
];
