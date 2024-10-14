import { getProduct, getSaleProducts } from "@/api/product.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import { branchState, productDiscountSelected } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ISaleProduct } from "./interface";

function SelectProductOrderModal({ isOpen, onCancel, onSave, discountItem }) {
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [productDiscount, setProductDiscount] = useRecoilState(productDiscountSelected);
  const [productCode, setProductCode] = useState("");
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  // const { data: productStore, isLoading: isLoadingProduct } = useQuery(
  //   ["LIST_PRODUCT", formFilter.page, formFilter.limit, formFilter.keyword, branchId, products],
  //   () => {
  //     const listProductUnitId = products.map((item) => item?.marketProduct?.productUnit?.id).join(",");
  //     return getProduct({ ...formFilter, branchId: branchId, listProductUnitId });
  //   },
  //   {
  //     enabled: !!isOpen,
  //   },
  // );

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
            isSelected: false,
            discountQuantity: 0,
          };
        });
        setListProduct(newData);
      },
    },
  );

  console.log("productStore", productStore);
  console.log("discountItem", discountItem);

  useEffect(() => {
    if (discountItem?.items) {
    }
  }, [discountItem]);

  const columns: any = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, { product, productUnit }) => <span>{name}</span>,
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
      title="Chọn hàng giảm giá"
      width={730}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <h4 className="text-base mb-3">
        Tổng số lượng: <span className="text-red-main">{listProduct[0]?.maxQuantity}</span>
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
            // const totalQuantity = selectedProducts.reduce((acc, product) => {
            //   return acc + product.discountQuantity;
            // }, 0);
            // if (totalQuantity > listProduct[0]?.maxQuantity) {
            //   message.error("Tổng số lượng không được lớn hơn " + listProduct[0]?.maxQuantity);
            //   return;
            // }
            onSave(selectedProducts);
            // onCancel();

            console.log("selectedProducts", selectedProducts);
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
