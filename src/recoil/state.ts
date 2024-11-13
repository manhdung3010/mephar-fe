/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { AtomEffect } from "recoil";
import { atom } from "recoil";
import { randomString } from "@/helpers";
import type { IImportProductLocal } from "@/modules/products/import-product/coupon/interface";
import type { IDiscount, ISaleProductLocal } from "@/modules/sales/interface";
const store = typeof window !== "undefined" ? window.localStorage : null;
const defaultOrder = randomString();
export const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    try {
      if (store) {
        const savedValue = store.getItem(key);
        if (savedValue != null) {
          setSelf(JSON.parse(savedValue));
        }

        onSet((newValue, _, isReset) => {
          isReset ? store.removeItem(key) : store.setItem(key, JSON.stringify(newValue));
        });
      }
    } catch (e) {
      if (store) {
        store.removeItem(key);
      }
      console.log(e);
    }
  };

export const profileState = atom<any>({
  key: "PROFILE_STATE",
  default: null,
});
export const collapsedState = atom<any>({
  key: "COLLAPSED_STATE",
  default: false,
});

export const branchState = atom<any>({
  key: "BRANCH_STATE",
  default: null,
  effects: [localStorageEffect("BRANCH_STATE")],
});
export const branchGenegalState = atom<any>({
  key: "BRANCH_GENEGEL_STATE",
  default: null,
  effects: [localStorageEffect("BRANCH_GENEGEL_STATE")],
});
export const agencyState = atom<any>({
  key: "AGENCY_STATE",
  default: null,
  effects: [localStorageEffect("AGENCY_STATE")],
});
export const storeState = atom<any>({
  key: "STORE_STATE",
  default: null,
  effects: [localStorageEffect("STORE_STATE")],
});

export const orderState = atom<{ [x: string]: ISaleProductLocal[] } | "">({
  key: "ORDER_STATE",
  default: { [defaultOrder]: [] },
  effects: [localStorageEffect("ORDER_STATE")],
});

export const orderActiveState = atom<string | "">({
  key: "ORDER_ACTIVE_STATE",
  default: defaultOrder,
  effects: [localStorageEffect("ORDER_ACTIVE_STATE")],
});

export const productImportState = atom<IImportProductLocal[]>({
  key: "PRODUCT_IMPORT_STATE",
  default: [],
  effects: [localStorageEffect("PRODUCT_IMPORT_STATE")],
});
export const checkInventoryState = atom<IImportProductLocal[]>({
  key: "CHECK_INVENTORY_STATE",
  default: [],
  effects: [localStorageEffect("CHECK_INVENTORY_STATE")],
});
export const marketOrderState = atom<any[]>({
  key: "MARKET_ORDER_STATE",
  default: [],
  effects: [localStorageEffect("MARKET_ORDER_STATE")],
});
export const marketOrderDiscountState = atom<any>({
  key: "MARKET_ORDER_DISCOUNT_STATE",
  default: {},
  effects: [localStorageEffect("MARKET_ORDER_DISCOUNT_STATE")],
});

export const productReturnState = atom<IImportProductLocal[]>({
  key: "PRODUCT_RETURN_STATE",
  default: [],
  effects: [localStorageEffect("PRODUCT_RETURN_STATE")],
});
export const productMoveState = atom<IImportProductLocal[]>({
  key: "PRODUCT_MOVE_STATE",
  default: [],
  effects: [localStorageEffect("PRODUCT_MOVE_STATE")],
});
export const productReveiveState = atom<IImportProductLocal[]>({
  key: "PRODUCT_RECEIVE_STATE",
  default: [],
  effects: [localStorageEffect("PRODUCT_RECEIVE_STATE")],
});
export const orderDiscountSelected = atom<any[]>({
  key: "ORDER_DISCOUNT_SELECTED",
  default: [],
  effects: [localStorageEffect("ORDER_DISCOUNT_SELECTED")],
});
export const productDiscountSelected = atom<any[]>({
  key: "PRODUCT_DISCOUNT_SELECTED",
  default: [],
  effects: [localStorageEffect("PRODUCT_DISCOUNT_SELECTED")],
});
export const discountTypeState = atom<string>({
  key: "DISCOUNT_TYPE_STATE",
  default: "",
  effects: [localStorageEffect("DISCOUNT_TYPE_STATE")],
});
export const vehicalState = atom<string>({
  key: "VEHICAL_STATE",
  default: "car",
  effects: [localStorageEffect("VEHICAL_STATE")],
});
export const discountState = atom<{ [x: string]: IDiscount } | "">({
  key: "DISCOUNT_STATE",
  default: {
    [defaultOrder]: {
      productDiscount: [],
      orderDiscount: [],
    },
  },
  effects: [localStorageEffect("DISCOUNT_STATE")],
});

// market
export const marketCartState = atom<any[]>({
  key: "MARKET_CART_STATE",
  default: [],
  effects: [localStorageEffect("MARKET_CART_STATE")],
});
export const paymentProductState = atom<any[]>({
  key: "PAYMENT_PRODUCT_STATE",
  default: [],
  effects: [localStorageEffect("PAYMENT_PRODUCT_STATE")],
});
