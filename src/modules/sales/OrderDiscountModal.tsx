import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import { discountState, orderActiveState } from "@/recoil/state";
import type { ColumnsType } from "antd/es/table";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from "../settings/discount/add-discount/Info";
import SelectProductOrderModal from "./SelectProductOrderModal";
import { message } from "antd";

/**
 * OrderDiscountModal component renders a modal for applying discounts to an order.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {() => void} props.onCancel - Function to call when the modal is cancelled.
 * @param {(value: any) => void} props.onSave - Function to call when the discount is saved.
 * @param {any} props.discountList - List of available discounts.
 *
 * @returns {JSX.Element} The rendered OrderDiscountModal component.
 *
 * @remarks
 * This component uses Recoil for state management and Ant Design for UI components.
 * It allows users to select and apply discounts to an order, including promotional gifts and price reductions.
 * The component also includes a nested modal for selecting products associated with the discounts.
 */
export function OrderDiscountModal({
  isOpen,
  onCancel,
  onSave,
  discountList,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  discountList: any;
}) {
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const [discountItem, setDiscountItem] = useState<any>(null);
  const [giftProduct, setGiftProduct] = useState<any>([]);
  const [discountProduct, setDiscountProduct] = useState<any>([]);
  useEffect(() => {
    if (discountList?.data?.data?.items) {
      const listBatchClone = cloneDeep(discountList?.data?.data?.items);
      listBatchClone.forEach((batch) => {
        if (discountObject[orderActive]?.orderDiscount[0]?.code === batch.code) {
          batch.isSelected = true;
        } else {
          batch.isSelected = false;
        }
      });
      setListDiscount(listBatchClone);
    }
  }, [discountList?.data?.data?.items, discountObject[orderActive]?.orderDiscount, isOpen]);
  const columns: ColumnsType<any> = [
    {
      title: "Chương trình khuyến mại",
      dataIndex: "name",
      className: "w-[200px]",
      key: "name",
      // render: (_, { batch }) => batch.name,
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
          {record?.type === "loyalty" && (
            <div>
              Tặng
              <span className="text-[#d64457]">{" " + formatNumber(items[0]?.apply?.pointValue)}điểm</span>
            </div>
          )}
          {record?.type === "gift" && (
            <div className="flex items-center gap-2 flex-wrap">
              <CustomButton
                className="h-[46px] py-2 px-4"
                disabled={record?.isSelected ? false : true}
                type={record?.isSelected ? "danger" : "disable"}
                onClick={() => {
                  setOpenSelectProduct(true);
                  setDiscountItem(record);
                }}
              >
                Chọn quà tặng
              </CustomButton>
            </div>
          )}
          {record?.type === "product_price" && (
            <div className="flex items-center gap-2 flex-wrap">
              <CustomButton
                className="h-[46px] py-2 px-4"
                disabled={record?.isSelected ? false : true}
                type={record?.isSelected ? "danger" : "disable"}
                onClick={() => {
                  setOpenSelectProduct(true);
                  setDiscountItem(record);
                }}
              >
                Chọn hàng giảm giá
              </CustomButton>
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
        columns={columns}
        scroll={{ x: 600 }}
        // loading={isLoading}
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
            let selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
            selectedDiscount = selectedDiscount.map((item) => ({
              ...item,
              items: item.items.map((i) => ({
                ...i,
                apply: {
                  ...i.apply,
                  productUnitSelected: item?.type === "gift" ? giftProduct : discountProduct,
                },
              })),
            }));
            if (selectedDiscount[0]?.type === "gift" && giftProduct?.length === 0) {
              message.error("Vui lòng chọn quà tặng");
              return;
            }
            if (selectedDiscount[0]?.type === "product_price" && discountProduct?.length === 0) {
              message.error("Vui lòng chọn quà khuyến mại");
              return;
            }
            onSave(selectedDiscount);
            setGiftProduct([]);
            setDiscountProduct([]);
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
          // type={isSaleReturn && batchErr.length > 0 ? 'disable' : 'danger'}
          // disabled={isSaleReturn && batchErr.length > 0 ? true : false}
        >
          Áp dụng
        </CustomButton>
      </div>
      <SelectProductOrderModal
        isOpen={openSelectProduct}
        onCancel={() => {
          setOpenSelectProduct(false);
          setGiftProduct([]);
          setDiscountProduct([]);
        }}
        onSave={(selectedGiftProduct, type) => {
          if (selectedGiftProduct.length > 0 && type === "gift") {
            setGiftProduct(selectedGiftProduct);
          } else if (selectedGiftProduct.length > 0 && type === "product_price") {
            setDiscountProduct(selectedGiftProduct);
          }
          setOpenSelectProduct(false);
        }}
        discountItem={discountItem}
      />
    </CustomModal>
  );
}
