import type { ColumnsType } from "antd/es/table";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";

import { branchState, discountState, discountTypeState, orderActiveState, orderDiscountSelected } from "@/recoil/state";
import { cloneDeep, set } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from "../settings/discount/add-discount/Info";
import { ISaleProduct } from "./interface";
import { useQuery } from "@tanstack/react-query";
import { getSaleProducts } from "@/api/product.service";
import SelectProductOrderModal from "./SelectProductOrderModal";

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
  const [orderDiscount, setOrderDiscount] = useRecoilState(orderDiscountSelected);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [discountType, setDiscountType] = useRecoilState(discountTypeState);

  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const [discountItem, setDiscountItem] = useState<any>(null);
  const [giftProduct, setGiftProduct] = useState<any>(null);

  const branchId = useRecoilValue(branchState);
  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    ["LIST_SALE_PRODUCT", 1, 9999, "", branchId],
    () => getSaleProducts({ page: 1, limit: 9999, keyword: "", branchId }),
    { enabled: discountList?.data?.data?.items?.length > 0 },
  );

  console.log("giftProduct", giftProduct);

  useEffect(() => {
    if (discountList?.data?.data?.items) {
      const listBatchClone = cloneDeep(discountList?.data?.data?.items);
      setListDiscount(listBatchClone);
    }
  }, [discountList?.data?.data?.items]);

  const findProduct = (productUnitId: any) => {
    return productUnitId
      .map((item) => {
        return products?.data?.items?.find((product) => product.id === item);
      })
      .map((i, index) => {
        return (
          <span>
            {i?.product?.name}
            {"("}
            {i?.productUnit?.unitName}
            {")"}
            {index < productUnitId.length - 1 ? ", " : ""}
          </span>
        );
      });
  };

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
              <span className="text-[#d64457]">{" " + formatNumber(items[0]?.apply?.pointValue)}</span>
              {(items[0]?.apply?.pointType === "amount" ? "" : "%") + " điểm"}
            </div>
          )}
          {record?.type === "gift" && (
            <div className="flex items-center gap-2 flex-wrap">
              {giftProduct &&
                discountItem?.code === record?.code &&
                giftProduct.map((item, index) => (
                  <div key={index} className="h-auto px-1 py-[2px] rounded bg-gray-200">
                    {item?.name} x {item?.discountQuantity}
                  </div>
                ))}
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
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={index}>
                  Hóa đơn từ <span className="text-[#d64457]">{formatMoney(item?.condition?.order?.from)}</span>, sản
                  phẩm <span className="text-[#d64457]">{findProduct(item?.apply?.productUnitId)}</span> được giảm giá{" "}
                  <span className="text-[#d64457]">
                    {formatNumber(item?.apply?.discountValue)}
                    {item?.apply?.discountType === "amount" ? "đ" : "%"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
    setOrderDiscount(selectedDiscount);
    setDiscountType("order");
  }, []);

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
            let selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
            selectedDiscount = selectedDiscount.map((item) => ({
              ...item,
              items: item.items.map((i) => ({
                ...i,
                apply: {
                  ...i.apply,
                  productUnitId: i.apply.productUnitId.map((unit) => {
                    return {
                      id: unit,
                      isSelected: false,
                    };
                  }),
                },
              })),
            }));
            const discountObjectClone = cloneDeep(discountObject);
            discountObjectClone[orderActive].orderDiscount = selectedDiscount;
            setDiscountObject(discountObjectClone);
            onSave(selectedDiscount);
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
        onCancel={() => setOpenSelectProduct(false)}
        onSave={(selectedGiftProduct) => {
          if (selectedGiftProduct.length > 0) {
            setGiftProduct(selectedGiftProduct);
          }
          setOpenSelectProduct(false);
        }}
        discountItem={discountItem}
      />
    </CustomModal>
  );
}
