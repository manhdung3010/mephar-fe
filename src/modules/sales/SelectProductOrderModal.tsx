import { getProduct, getSaleProducts } from "@/api/product.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import {
  branchState,
  discountState,
  orderActiveState,
  orderDiscountSelected,
  productDiscountSelected,
} from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ISaleProduct } from "./interface";
import classNames from "classnames";

function SelectProductOrderModal({ isOpen, onCancel, onSave, discountItem }) {
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [productCode, setProductCode] = useState("");
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  console.log("discountItem", discountItem);

  const { data: productStore, isLoading: isLoadingProduct } = useQuery(
    [
      "LIST_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
      discountItem?.items[0]?.apply?.productUnitId,
    ],
    () => {
      const listProductUnitId = discountItem?.items[0]?.apply?.productUnitId.map((item) => item).join(",");
      return getProduct({ ...formFilter, branchId: branchId, listProductUnitId });
    },
    {
      enabled: !!isOpen && discountItem?.items[0]?.apply?.productUnitId?.length > 0,
      onSuccess: (data) => {
        const newData = data?.data?.items.map((item) => {
          return {
            ...item,
            key: item.id,
            // check if product is selected in discountObject[orderActive] or not to set isSelected
            isSelected: discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected?.find(
              (product) => product.id === item.id,
            )
              ? true
              : false,
            discountQuantity:
              discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected?.find(
                (product) => product.id === item.id,
              )?.discountQuantity || 0,
          };
        });
        setListProduct(newData);
      },
    },
  );

  useEffect(() => {
    if (discountItem?.items) {
    }
  }, [discountItem]);

  const columns: any = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, { product, productUnit }) => <span className="line-clamp-1">{name}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "discountQuantity",
      key: "discountQuantity",
      render: (discountQuantity, { id }) => (
        <CustomInput
          onChange={(value) => {
            // update quantity of product
            const listProductClone = cloneDeep(listProduct);
            const product = listProductClone.find((product) => product.id === id);
            product.discountQuantity = value;
            setListProduct(listProductClone);
          }}
          value={discountQuantity}
          type="number"
          className="w-20"
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price) => formatMoney(price),
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      key: "inventory",
      render: (inventory) => formatNumber(inventory),
    },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={discountItem?.type === "product_price" ? "Chọn hàng giảm giá" : "Chọn hàng tặng"}
      width={730}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <h4 className="text-base mb-3">
        Tổng số lượng tối đa:{" "}
        <span className="text-red-main">{formatNumber(discountItem?.items[0]?.apply?.maxQuantity)}</span>
      </h4>
      <CustomTable
        dataSource={listProduct?.map((batch: any) => ({
          ...batch,
          key: batch.id,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        loading={isLoadingProduct}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: [...listProduct.filter((batch) => batch.isSelected).map((batch: any) => batch.id)],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listProduct);

            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.id)) {
                return {
                  ...batch,
                  quantity: batch.quantity || 1,
                  discountQuantity: 1,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false, quantity: 0, discountQuantity: 0 };
            });

            setListProduct(listBatchClone);
          },
        }}
      />

      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton onClick={onCancel} outline={true} className="h-[46px] min-w-[150px] py-2 px-4">
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            const selectedProducts = listProduct.filter((product) => product.isSelected);
            // check total quantity of productUnitId
            const totalQuantity = selectedProducts.reduce((acc, product) => {
              return acc + product.discountQuantity;
            }, 0);
            if (totalQuantity > discountItem?.items[0]?.apply?.maxQuantity) {
              message.error("Tổng số lượng không được lớn hơn " + discountItem?.items[0]?.apply?.maxQuantity);
              return;
            }
            onSave(selectedProducts, discountItem?.type);
            // onCancel();
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  );
}

export default SelectProductOrderModal;
