import type { EProductStatus, EProductType } from "@/enums";

export interface IBatch {
  productId: number;
  id: number;
  productKey: string;
  batchId: number;
  productUnitId: number;
  quantity: number;
  inventory: number;
  originalInventory: number;
  isSelected: boolean;
  expiryDate: string;
  saleQuantity?: number;
  batch: { id: number; name: string };
  productUnit: {
    id: number;
    unitName: string;
    exchangeValue: number;
    price: number;
    isBaseUnit: boolean;
    returnPrice?: number;
  };
}

export interface IProductUnit {
  marketPrice: any;
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
  returnPrice?: number;
  oldPrice?: number;
}

export interface ISaleProduct {
  id: number;
  storeId: number;
  code: string;
  barCode: string;
  branchId: number;
  productId: number;
  batchId: number;
  productUnitId: number;
  quantity: number;
  expiryDate: string;
  isDiscount?: boolean;
  discountQuantity?: number;
  maxQuantity?: number; // số lượng hàng KM
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
  product: any;
  inventory?: number;
  isBuyByNumber?: boolean;
  buyNumberType?: number;
  itemPrice?: number;
  discountCode?: string;
  saleQuantity?: number;
  quantityLast?: number;
  originalQuantity?: number;
  pointValue?: number;
  isDiscountPrice?: boolean;
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
  isDiscount?: boolean;
  isGift?: boolean;
  price?: any;
  discountValue?: any;
  discountType?: string;
  itemDiscountProduct?: any;
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

export interface IDiscount {
  productDiscount: any[];
  orderDiscount: any[];
}
