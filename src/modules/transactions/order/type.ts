import { EDiscountType, EGender, EOrderStatus } from "@/enums";

export interface IOrder {
  id: number;
  key: number;
  number: string;
  code: string;
  quantity: number;
  cashOfCustomer: number;
  earnMoney: number;
  customer: { fullName: string };
  delivery: string;
  status: EOrderStatus;
  createdAt: string;
  note: string;
  totalPrice: number;
  products: {
    productId: number;
    price: number;
    quantity: number;
    name: string;
    discount: number;
    product: {
      code: string;
      shortName: string;
      name: string;
      image?: { path: string };
    };
    productUnit: {
      unitName: string;
      price: number;
    };
  }[];
  discount: number;
  discountType?: EDiscountType;
  branch?: {
    name: string;
  };
  user?: {
    fullName: string;
  };
  prescription?: {
    code: string;
    name: string;
    gender: EGender;
    age: string;
    weight: string;
    identificationCard: string;
    healthInsuranceCard: string;
    address: string;
    supervisor: string;
    phone: string;
    diagnostic: string;
    createdBy: 50;
    doctor: {
      name: string;
      phone: string;
      code: string;
      email: string;
      gender: EGender;
    };
    healthFacility: {
      name: string;
    };
  };
  description: string;
}
