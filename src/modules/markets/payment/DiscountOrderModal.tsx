import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import {
  branchState,
  discountState,
  marketOrderDiscountState,
  marketOrderState,
  orderActiveState,
} from "@/recoil/state";
import type { ColumnsType } from "antd/es/table";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { message } from "antd";
import {
  EDiscountBillMethod,
  EDiscountBillMethodLabel,
  EDiscountGoodsMethodLabel,
  EDiscountType,
} from "@/modules/settings/discount/add-discount/Info";
import { useQuery } from "@tanstack/react-query";
import { getOrderDiscountList } from "@/api/discount.service";

/**
 * DiscountOrderModal component renders a modal for applying discounts to an order.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {() => void} props.onCancel - Function to call when the modal is cancelled.
 * @param {(value: any) => void} props.onSave - Function to call when the discount is saved.
 * @param {any} props.discountList - List of available discounts.
 *
 * @returns {JSX.Element} The rendered DiscountOrderModal component.
 *
 * @remarks
 * This component uses Recoil for state management and Ant Design for UI components.
 * It allows users to select and apply discounts to an order, including promotional gifts and price reductions.
 * The component also includes a nested modal for selecting products associated with the discounts.
 */
export function DiscountOrderModal({
  isOpen,
  onCancel,
  onSave,
  customerId,
  totalPrice,
  toStoreId,
  selectedDiscount,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value, storeId) => void;
  customerId: string;
  totalPrice: number;
  toStoreId?: any;
  selectedDiscount?: any;
}) {
  const branchId = useRecoilValue(branchState);
  const [importProducts, setImportProducts] = useRecoilState(marketOrderState);
  const [marketOrderDiscount, setMarketOrderDiscount] = useRecoilState(marketOrderDiscountState);
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [giftProduct, setGiftProduct] = useState<any>([]);

  const getDiscountPostData = () => {
    const products = importProducts?.map((product) => ({
      productUnitId: product.productUnitId,
      quantity: product.quantity,
    }));
    return {
      products,
      totalPrice: totalPrice,
      ...(customerId && {
        customerId: customerId,
      }),
      branchId: branchId,
      toStoreId,
    };
  };
  const data: any = getDiscountPostData();
  const { data: discountList, isLoading } = useQuery(
    ["ORDER_DISCOUNT_LIST", customerId, totalPrice, EDiscountBillMethod.ORDER_PRICE],
    () => getOrderDiscountList(data, EDiscountBillMethod.ORDER_PRICE, "ONLINE"),
    {
      enabled: totalPrice > 0 && !!isOpen,
    },
  );

  useEffect(() => {
    if (discountList?.data?.data?.items) {
      const listBatchClone = cloneDeep(discountList?.data?.data?.items);
      listBatchClone.forEach((batch) => {
        const marketOrderDiscount = selectedDiscount?.find((item) => item.code === batch.code);
        if (marketOrderDiscount?.code === batch.code) {
          batch.isSelected = true;
        } else {
          batch.isSelected = false;
        }
      });
      setListDiscount(listBatchClone);
    }
  }, [discountList?.data?.data?.items, selectedDiscount, isOpen]);
  const columns: ColumnsType<any> = [
    {
      title: "Chương trình khuyến mại",
      dataIndex: "name",
      className: "w-[200px]",
      key: "name",
    },
    {
      title: "Hình thức khuyến mại",
      dataIndex: "type",
      key: "type",
      className: "w-[200px]",
      render: (type, { target }) => (
        <span>
          {target === "order"
            ? EDiscountBillMethodLabel[type.toUpperCase()]
            : EDiscountGoodsMethodLabel[type.toUpperCase()]}
        </span>
      ),
    },
    {
      title: "Quà khuyến mại",
      dataIndex: "items",
      key: "items",
      render: (items, record) => (
        <div>
          {record?.type === "order_price" && (
            <div>
              Từ <span className="text-[#d64457]">{formatMoney(items[0]?.condition?.order?.from)}</span> giảm giá
              <span className="text-[#d64457]">
                {" " + formatNumber(items[0]?.apply?.discountValue)}
                <span>{items[0]?.apply?.discountType === "amount" ? "đ" : "%"}</span>
              </span>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Khuyến mại trên hóa đơn"
      width={980}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />
      <CustomTable
        dataSource={
          listDiscount &&
          listDiscount?.map((item: any) => ({
            ...item,
            key: item.id,
          }))
        }
        loading={isLoading}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          type: "radio",
          selectedRowKeys: [...listDiscount.filter((batch) => batch.isSelected).map((batch: any) => batch.id)],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listDiscount);
            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.id)) {
                return {
                  ...batch,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false };
            });
            if (selectedRowKeys) {
              setGiftProduct([]);
            }
            setListDiscount(listBatchClone);
          },
        }}
      />
      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={() => {
            onCancel();
            setGiftProduct([]);
          }}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            let selectedDiscount = listDiscount.find((batch) => batch.isSelected);
            setMarketOrderDiscount(selectedDiscount);
            onSave(selectedDiscount, toStoreId);
            onCancel();
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
          // type={isSaleReturn && batchErr.length > 0 ? 'disable' : 'danger'}
          // disabled={isSaleReturn && batchErr.length > 0 ? true : false}
        >
          Áp dụng
        </CustomButton>
      </div>
    </CustomModal>
  );
}
