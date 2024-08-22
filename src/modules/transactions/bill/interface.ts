import { EOrderStatus, EOrderStatusLabel } from "@/enums";
import {
  EOrderMarketStatus,
  EOrderMarketStatusLabel,
} from "@/modules/markets/type";

export const billStatusData = [
  {
    value: EOrderMarketStatus.PENDING,
    label: EOrderMarketStatusLabel.PENDING,
  },
  {
    value: EOrderMarketStatus.CONFIRM,
    label: EOrderMarketStatusLabel.CONFIRM,
  },
  {
    value: EOrderMarketStatus.PROCESSING,
    label: EOrderMarketStatusLabel.PROCESSING,
  },
  {
    value: EOrderMarketStatus.SEND,
    label: EOrderMarketStatusLabel.SEND,
  },
  {
    value: EOrderMarketStatus.DONE,
    label: EOrderMarketStatusLabel.DONE,
  },
  {
    value: EOrderMarketStatus.CANCEL,
    label: EOrderMarketStatusLabel.CANCEL,
  },
  {
    value: EOrderMarketStatus.CLOSED,
    label: EOrderMarketStatusLabel.CLOSED,
  },
];
