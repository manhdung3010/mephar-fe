import type { EProductStatus, EProductType } from "@/enums";

export interface IBatch {
  productId: number;
  productKey: string;
  batchId: number;
  productUnitId: number;
  quantity: number;
  inventory: number;
  originalInventory: number;
  isSelected: boolean;
  expiryDate: string;
  batch: { id: number; name: string };
  productUnit: {
    id: number;
    unitName: string;
    exchangeValue: number;
    price: number;
    isBaseUnit: boolean;
  };
}

export interface IProductUnit {
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
}

export interface ISaleProduct {
  id: number;
  storeId: number;
  code: string;
  branchId: number;
  productId: number;
  batchId: number;
  productUnitId: number;
  quantity: number;
  expiryDate: string;
  batch: {
    id: number;
    name: string;
    expiryDate: string;
  };
  productUnit: IProductUnit;
  product: {
    id: number;
    name: string;
    shortName: string;
    code: string;
    barCode: string;
    groupProductId: number;
    productCategoryId: number | null;
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
    isBatchExpireControl: boolean;
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
    productUnit: IProductUnit[];
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
  batches: {
    batchId: number;
    productUnitId: number;
    quantity: number;
    expiryDate: string;
    batch: { id: number; name: string };
    productUnit: {
      id: number;
      unitName: string;
      exchangeValue: number;
      price: number;
      isBaseUnit: boolean;
    };
  }[];
}

export interface ISaleProductLocal extends Omit<ISaleProduct, "batches"> {
  productKey: string;
  key?: number;
  originProductUnitId: number;
  batches: {
    batchId: number;
    productUnitId: number;
    quantity: number;
    inventory: number;
    originalInventory: number;
    isSelected: boolean;
    expiryDate: string;
    name: string;
    productUnit: {
      id: number;
      unitName: string;
      exchangeValue: number;
      price: number;
      isBaseUnit: boolean;
    };
  }[];
}

export interface ISampleMedicine {
  id: number;
  name: string;
  code: string;
  position: any; // Adjust the type as needed
  weight: any; // Adjust the type as needed
  description: string;
  status: number;
  image: {
    filePath: string;
    id: number;
    originalName: string;
    fileName: string;
    path: string;
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
  products: ISaleProduct[];
}
