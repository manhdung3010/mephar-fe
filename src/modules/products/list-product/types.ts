import type { EProductStatus, EProductType } from "@/enums";

export interface IProduct {
  key: number;
  id: number;
  barCode: string;
  code: string;
  name: string;
  baseUnit: string;
  groupProduct?: { name: string };
  type: EProductType;
  quantity: number;
  isBatchExpireControl: boolean;
  price: string;
  primePrice: string;
  tempPrimePrice: string;
  shortName: string;
  weight: string;
  productPosition?: { name: string };
  warningExpiryDate: string;
  warningExpiryText: string;
  registerNumber: string;
  productDosage?: { name: string };
  productManufacture?: {
    name: string;
  };
  packingSpecification: string;
  description: string;
  activeElement: string;
  productUnit: {
    id: number;
    product: any;
    unitName: string;
    isBaseUnit: boolean;
    exchangeValue: string;
  }[];
  content: string;
  country?: { name: string };
  status: EProductStatus;
  image?: { path: string };
  imageUrl?: any;
  batches?: {
    batchId: number;
    name: string;
    quantity: number;
    expiredDate: string;
  };
  unitId?: number; // Đơn vị tính
  drugCode?: string; // Mã thuốc
  unitQuantity?: number; // Tồn kho theo đơn vị
  productId?: number;
}
