import type { ColumnsType } from "antd/es/table";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import { branchState, discountState, orderActiveState } from "@/recoil/state";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from "../settings/discount/add-discount/Info";
import SelectProductOrderModal from "./SelectProductOrderModal";
import { message } from "antd";

/**
 * Component for displaying and managing product discounts within a modal.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {() => void} props.onCancel - Function to call when the modal is cancelled.
 * @param {(value: any) => void} props.onSave - Function to call when the discount is saved.
 * @param {any[]} [props.discountList] - List of available discounts.
 * @param {any} props.productUnitSelected - The selected product unit.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ProductDiscountModal
 *   isOpen={true}
 *   onCancel={handleCancel}
 *   onSave={handleSave}
 *   discountList={discounts}
 *   productUnitSelected={selectedProductUnit}
 * />
 */
export function ProductDiscountModal({
  isOpen,
  onCancel,
  onSave,
  discountList,
  productUnitSelected,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  discountList?: any;
  productUnitSelected: any;
}) {
  const orderActive = useRecoilValue(orderActiveState);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  const [isOpenSelectProduct, setIsOpenSelectProduct] = useState(false);
  const [discountItem, setDiscountItem] = useState(null);
  const [giftProduct, setGiftProduct] = useState<any>([]);
  const [discountProduct, setDiscountProduct] = useState<any>([]);
  useEffect(() => {
    if (discountList) {
      // show old selected discount from productDiscount list, if same productUnitId then set isSelected to true
      const discounts = cloneDeep(discountObject);
      const productDiscount = discounts[orderActive]?.productDiscount;
      const selectedDiscount = discountList.map((discount) => {
        const isSelected = productDiscount?.some((item) => item.code === discount?.code);
        return {
          ...discount,
          productUnitSelected,
          isSelected,
        };
      });
      setListDiscount(selectedDiscount);
    }
  }, [discountList]);

  const columns: ColumnsType<any> = [
    {
      title: "Chương trình khuyến mại",
      dataIndex: "name",
      key: "name",
      // render: (_, { batch }) => batch.name,
    },
    {
      title: "Hình thức khuyến mại",
      dataIndex: "type",
      key: "type",
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
          {record?.type === "product_price" && (
            <CustomButton
              type={record?.isSelected ? "danger" : "disable"}
              disabled={!record?.isSelected}
              onClick={() => {
                setIsOpenSelectProduct(true);
                setDiscountItem(record);
              }}
              className="max-w-fit !h-11"
            >
              Chọn quà khuyến mại
            </CustomButton>
          )}
          {record?.type === "gift" && (
            <CustomButton
              type={record?.isSelected ? "danger" : "disable"}
              disabled={!record?.isSelected}
              onClick={() => {
                setIsOpenSelectProduct(true);
                setDiscountItem(record);
              }}
            >
              Chọn quà tặng
            </CustomButton>
          )}
          {record?.type === "loyalty" && (
            <div>
              Mua {formatNumber(items[0]?.condition?.product?.from)} được tặng{" "}
              <span className="text-[#d64457]">{" " + formatNumber(items[0]?.apply?.pointValue)}</span>
              {(items[0]?.apply?.pointType === "amount" ? "" : "%") + " điểm"}
            </div>
          )}
          {record?.type === "price_by_buy_number" && (
            <div>
              {items[0]?.apply?.changeType === "type_price" ? (
                <div>
                  Mua {formatNumber(items[0]?.condition?.product?.from)} với giá{" "}
                  <span className="text-[#d64457]">{formatMoney(items[0]?.apply?.fixedPrice)}</span>
                </div>
              ) : (
                <div>
                  Mua {formatNumber(items[0]?.condition?.product?.from)} được giảm giá{" "}
                  <span className="text-[#d64457]">{formatMoney(items[0]?.apply?.fixedPrice)}</span>
                </div>
              )}
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
      title="Khuyến mại trên hàng hóa"
      width={980}
      // onSubmit={onCancel}
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
            setListDiscount(listBatchClone);
          },
        }}
      />

      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton onClick={onCancel} outline={true} className="h-[46px] min-w-[150px] py-2 px-4">
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            let selectedDiscount: any = listDiscount.find((batch) => batch.isSelected);
            selectedDiscount = {
              ...selectedDiscount,
              items: selectedDiscount.items.map((i) => ({
                ...i,
                apply: {
                  ...i.apply,
                  productUnitSelected:
                    selectedDiscount?.type === "gift"
                      ? giftProduct.map((item) => ({
                          ...item,
                          discountCode: selectedDiscount.code,
                        }))
                      : selectedDiscount?.type === "product_price"
                      ? discountProduct.map((item) => ({
                          ...item,
                          discountCode: selectedDiscount.code,
                        }))
                      : [],
                },
              })),
            };
            if (selectedDiscount?.type === "gift" && giftProduct.length === 0) {
              message.error("Vui lòng chọn quà tặng");
              return;
            }
            if (selectedDiscount?.type === "product_price" && discountProduct.length === 0) {
              message.error("Vui lòng chọn quà khuyến mại");
              return;
            }
            onSave(selectedDiscount);
            setGiftProduct([]);
            setDiscountProduct([]);
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
          disabled={!listDiscount.some((batch) => batch.isSelected)}
        >
          Áp dụng
        </CustomButton>
      </div>

      <SelectProductOrderModal
        isOpen={isOpenSelectProduct}
        onCancel={() => {
          setIsOpenSelectProduct(false);
          setGiftProduct([]);
          setDiscountProduct([]);
        }}
        onSave={(selectedGiftProduct, type) => {
          if (selectedGiftProduct.length > 0 && type === "gift") {
            setGiftProduct(selectedGiftProduct);
          } else if (selectedGiftProduct.length > 0 && type === "product_price") {
            setDiscountProduct(selectedGiftProduct);
          }
          setIsOpenSelectProduct(false);
        }}
        discountItem={discountItem}
        type="product"
      />
    </CustomModal>
  );
}
