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

function SelectProductOrderModal({ isOpen, onCancel, onSave, discountItem, type = "order" }) {
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [productCode, setProductCode] = useState("");
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    isSale: true,
  });

  const { data: productStore, isLoading: isLoadingProduct } = useQuery(
    [
      "LIST_PRODUCT_SALE_STORE",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
      discountItem?.items[0]?.apply?.productUnitId,
    ],
    () => {
      const listProductUnitId = discountItem?.items[0]?.apply?.productUnitId.map((item) => item).join(",");
      return getSaleProducts({ ...formFilter, branchId: branchId, listProductUnitId });
    },
    {
      enabled: !!isOpen && discountItem?.items[0]?.apply?.productUnitId?.length > 0,
      onSuccess: (data) => {
        const newData = data?.data?.items.map((item) => {
          return {
            ...item,
            key: item.id,
            // check if product is selected in discountObject[orderActive] or not to set isSelected
            isSelected:
              type === "order"
                ? discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected?.some(
                    (product) => product.id === item.id,
                  )
                : discountObject[orderActive]?.productDiscount
                    .find((d) => d.isSelected)
                    ?.items[0]?.apply?.productUnitSelected?.some((product) => product.id === item.id),
            discountQuantity:
              type === "order"
                ? discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected?.find(
                    (product) => product.id === item.id,
                  )?.discountQuantity
                : discountObject[orderActive]?.productDiscount
                    .find((d) => d.isSelected)
                    ?.items[0]?.apply?.productUnitSelected?.find((product) => product.id === item.id)?.discountQuantity,
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
      render: (name, { product, productUnit }) => <span className="line-clamp-1">{product?.name}</span>,
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
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => formatNumber(quantity),
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
          selectedRowKeys: [...listProduct.filter((batch) => batch.isSelected).map((batch: any) => batch.id)],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listProduct);

            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.id)) {
                return {
                  ...batch,
                  discountQuantity: 1,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false, discountQuantity: 0 };
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
