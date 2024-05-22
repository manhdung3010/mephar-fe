import type { EReturnProductStatus } from "@/enums";

export interface IRecord {
  key: number;
  id: number;
  code: string;
  description: string;
  store: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  branch: {
    id: number;
    name: string;
    phone: string;
    code: string;
    zipCode: string;
    isDefaultBranch: false;
  };
  creator: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    avatarId: number;
    phone: string;
  };
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  supplier: {
    id: number;
    name: string;
    phone: string;
    email: string;
    code: string;
    taxCode: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    storeId: number;
    address: string;
    companyName: string;
    groupSupplierId: number;
    note: string;
    createdAt: string;
    groupSupplier: {
      id: number;
      name: string;
      description: string;
      storeId: number;
    };
    province?: {
      id: number;
      name: string;
    };
    district?: {
      id: number;
      name: string;
    };
    ward?: {
      id: number;
      name: string;
    };
  };
  products?: IProduct[];
  totalPrice: number;
  paid: number;
  debt: number;
  discount: number;
  status: EReturnProductStatus;
  createdAt: string;
}

export interface IProduct {
  id: number;
  productId: number;
  inboundId: number;
  importPrice: number;
  totalQuantity: number;
  totalPrice: number;
  discount: number;
  product: {
    name: string;
    shortName: string;
    code: string;
    barCode: string;
    imageId: number;
    image?: {
      filePath: string;
      id: number;
      originalName: string;
      fileName: string;
      path: string;
    };
  };
  productBatchHistories: {
    id: number;
    discount?: number;
    importPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
}

export interface IBatch {
  id: number;
  batchId?: number;
  isSelected?: boolean;
  name: string;
  quantity: number;
  inventory: number; // client;
  expiryDate: string;
  originalInventory: number; // client;
  saleQuantity?: number;
}
