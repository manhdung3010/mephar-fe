import type { ECommonStatus, EGender, EUserPositions } from "@/enums";

export interface ICustomer {
  id: number;
  code: string;
  phone: string;
  email: string;
  fullName: string;
  address: string;
  avatarId: string;
  birthday: string;
  gender: EGender;
  groupCustomerId?: number;
  groupCustomer?: { name: string };
  position?: EUserPositions;
  taxCode?: string;
  type: 1;
  status: ECommonStatus;
  createdAt: string;
  created_by?: {
    username: string;
  };
  avatar?: {
    path: string;
  };
  province?: {
    name: string;
  };
  district?: {
    name: string;
  };
  ward?: {
    name: string;
  };
}
