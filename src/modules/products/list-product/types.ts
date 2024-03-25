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
  price: string;
  primePrice: string;
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
  productUnit: { id: number; unitName: string; isBaseUnit: boolean }[];
  content: string;
  country?: { name: string };
  status: EProductStatus;
  image?: { path: string };
  batches?: {
    batchId: number;
    name: string;
    quantity: number;
    expiredDate: string;
  };
  unitId?: number;
  drugCode?: string;
}
