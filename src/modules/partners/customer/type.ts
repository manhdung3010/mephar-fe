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
  facebook: string;
  gender: EGender;
  groupCustomerId?: number;
  groupCustomer?: { name: string };
  listGroupCustomer?: any;
  position?: EUserPositions;
  taxCode?: string;
  companyName?: string;
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
  note?: string;
  lat?: string; // Thêm trường lat kiểu string
  lng?: string; // Thêm trường lng kiểu string
}
