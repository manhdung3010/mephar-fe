import type { EProductStatus, EProductType } from '@/enums';

export interface IImportProduct {
  id: number;
  unitName: string;
  exchangeValue: number;
  price: number;
  productId: number;
  code: string;
  barCode: string;
  isDirectSale: boolean;
  isBaseUnit: boolean;
  quantity: number;
  point: number;
  product: {
    id: number;
    name: string;
    shortName: string;
    code: string;
    barCode: string;
    groupProductId: number;
    productCategoryId: number | null;
    isBatchExpireControl: boolean;
    imageId: number | null;
    dosageId: number;
    manufactureId: number | null;
    positionId: number;
    countryId: number | null;
    primePrice: number;
    price: number;
    weight: string;
    warningExpiryDate: string;
    warningExpiryText: string;
    isDirectSale: boolean;
    registerNumber: string | null;
    activeElement: string | null;
    content: string | null;
    packingSpecification: string | null;
    minInventory: number | null;
    maxInventory: number | null;
    description: string;
    note: string;
    baseUnit: string;
    inventory: number;
    quantitySold: number;
    storeId: number;
    branchId: number;
    type: EProductType;
    isLoyaltyPoint: boolean;
    status: EProductStatus;
    createdAt: string;
    image?: {
      id: number;
      path: string;
    };
    productManufacture?: {
      id: number;
      name: string;
    };
    productDosage?: {
      id: number;
      name: string;
    };
    productPosition?: {
      id: number;
      name: string;
    };
    country?: {
      id: number;
      name: string;
    };
    groupProduct?: {
      id: number;
      name: string;
    };
    productCategory?: {
      id: number;
      name: string;
    };
    productUnit: {
      id: number;
      unitName: string;
      exchangeValue: number;
      price: number;
      productId: number;
      code: string;
      barCode: string;
      isDirectSale: boolean;
      isBaseUnit: boolean;
      point: number;
    }[];
  };
  store: {
    id: number;
    name: string;
    phone: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    address: string;
    createdAt: string;
  };
  branch: {
    id: number;
    name: string;
    phone: string;
    code: string;
    zipCode: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    isDefaultBranch: boolean;
    createdAt: string;
  };
}

export interface IImportProductLocal extends IImportProduct {
  key?: number;
  productKey: string; // client
  discountValue: number; // client
  inventory: number; // client
  batches: {
    id: number;
    name: string;
    quantity: number;
    expiryDate: string;
    inventory: number;
    originalInventory: number;
  }[]; // client
}
