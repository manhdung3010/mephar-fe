import type { ColumnsType } from "antd/es/table";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";

import {
  branchState,
  discountTypeState,
  orderDiscountSelected,
  productDiscountSelected,
} from "@/recoil/state";
import { cloneDeep, set } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  EDiscountBillMethodLabel,
  EDiscountGoodsMethodLabel,
} from "../settings/discount/add-discount/Info";
import { useQuery } from "@tanstack/react-query";
import { ISaleProduct } from "./interface";
import { getSaleProducts } from "@/api/product.service";
import SelectProductDiscount from "./SelectProductDiscount";
import { message } from "antd";

export function ProductDiscountModal({
  isOpen,
  onCancel,
  onSave,
  discountList,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  discountList?: any;
}) {
  const branchId = useRecoilValue(branchState);
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  const [orderDiscount, setOrderDiscount] = useRecoilState(
    orderDiscountSelected
  );
  const [productDiscount, setProductDiscount] = useRecoilState(
    productDiscountSelected
  );
  const [discountType, setDiscountType] = useRecoilState(discountTypeState);
  const [isOpenSelectProduct, setIsOpenSelectProduct] = useState(false);
  const [discountId, setDiscountId] = useState();
  // const { data: products, isLoading: isLoadingProduct, isSuccess } = useQuery<{
  //   data?: { items: ISaleProduct[] };
  // }>(
  //   [
  //     'LIST_SALE_PRODUCT',
  //     1,
  //     9999,
  //     "",
  //     branchId,
  //   ],
  //   () => getSaleProducts({ page: 1, limit: 9999, keyword: "", branchId }),
  //   { enabled: discountList?.data?.data?.items?.length > 0 }
  // );
  useEffect(() => {
    if (discountList) {
      // show old selected discount from productDiscount list, if same productUnitId then set isSelected to true
      const listBatchClone = cloneDeep(discountList);
      const productDiscountClone = cloneDeep(productDiscount);
      const selectedDiscount = listBatchClone.map((batch) => {
        const index = productDiscountClone.findIndex(
          (item) => item.code === batch.code
        );
        // const index = listBatchClone.findIndex((item) => item.productUnitId === batch.productUnitId);
        if (index !== -1) {
          return {
            ...batch,
            isSelected: true,
          };
        }
        return {
          ...batch,
          isSelected: false,
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
      render: (items, { type, id }) => (
        <div>
          {/* {
            type === "product_price" && (
              <div>
                Mua {formatNumber(items[0]?.condition?.product?.from)} x {findProduct(items[0]?.condition?.productUnitId)} được giảm {" "}
                <span className='text-[#d64457]'>{formatNumber(items[0]?.apply?.discountValue)}{items[0]?.apply?.discountType === "amount" ? "đ" : "%"}</span> {items[0]?.apply?.maxQuantity} x {findProduct(items[0]?.apply?.productUnitId)}
              </div>
            )
          } */}
          {type === "product_price" && (
            <CustomButton
              type="danger"
              onClick={() => {
                setIsOpenSelectProduct(true);
                setDiscountId(id);
              }}
            >
              Chọn quà khuyến mại
            </CustomButton>
          )}
          {type === "gift" && (
            <CustomButton
              type="danger"
              onClick={() => {
                setIsOpenSelectProduct(true);
                setDiscountId(id);
              }}
            >
              Chọn quà tặng
            </CustomButton>
          )}
          {/* {
            type === "gift" && (
              <div>
                Mua {formatNumber(items[0]?.condition?.product?.from)} x {findProduct(items[0]?.condition?.productUnitId)} được tặng {" "}
                {items[0]?.apply?.maxQuantity} x {findProduct(items[0]?.apply?.productUnitId)}
              </div>
            )
          } */}
          {type === "loyalty" && (
            <div>
              Mua {formatNumber(items[0]?.condition?.product?.from)} được tặng{" "}
              <span className="text-[#d64457]">
                {" " + formatNumber(items[0]?.apply?.pointValue)}
              </span>
              {(items[0]?.apply?.pointType === "amount" ? "" : "%") + " điểm"}
            </div>
          )}
          {type === "price_by_buy_number" && (
            <div>
              {items[0]?.apply?.changeType === "type_price" ? (
                <div>
                  Mua {formatNumber(items[0]?.condition?.product?.from)} với giá{" "}
                  <span className="text-[#d64457]">
                    {formatMoney(items[0]?.apply?.fixedPrice)}
                  </span>
                </div>
              ) : (
                <div>
                  Mua {formatNumber(items[0]?.condition?.product?.from)} được
                  giảm giá{" "}
                  <span className="text-[#d64457]">
                    {formatMoney(items[0]?.apply?.fixedPrice)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
    setOrderDiscount(selectedDiscount);
    setDiscountType("product");
  }, []);

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
          selectedRowKeys: [
            ...listDiscount
              .filter((batch) => batch.isSelected)
              .map((batch: any) => batch.id),
          ],
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
        <CustomButton
          onClick={onCancel}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            // const selectedDiscount = listDiscount.find(
            //   (batch) => batch.isSelected
            // );

            // if (
            //   selectedDiscount.type === "gift" ||
            //   selectedDiscount.type === "product_price"
            // ) {
            //   return message.error("Chưa chọn quà khuyến mại/ quà tặng");
            // }

            // // setProductDiscount([...productDiscount, ...selectedDiscount].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
            // const selectedDiscountProduct = {
            //   ...selectedDiscount,
            //   discountKey:
            //     selectedDiscount?.id +
            //     "-" +
            //     selectedDiscount?.items[0]?.condition?.productUnitId[0],
            //   productUnitId:
            //     selectedDiscount?.items[0]?.condition?.productUnitId[0],
            // };

            // // set selectedDiscountProduct to productDiscount, check if it's already exist in productDiscount then replace it
            // const index = productDiscount.findIndex(
            //   (item) =>
            //     item.productUnitId === selectedDiscountProduct.productUnitId
            // );

            // if (index !== -1) {
            //   setProductDiscount([
            //     ...productDiscount.slice(0, index),
            //     selectedDiscountProduct,
            //     ...productDiscount.slice(index + 1),
            //   ]);
            // } else {
            //   setProductDiscount([...productDiscount, selectedDiscountProduct]);
            // }

            // setDiscountType("product");
            // onSave(selectedDiscountProduct);
            // onCancel();
            // return;
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
          disabled={!listDiscount.some((batch) => batch.isSelected)}
        >
          Áp dụng
        </CustomButton>
      </div>

      {/* <SelectProductDiscount
        isOpen={isOpenSelectProduct}
        onCancel={() => setIsOpenSelectProduct(false)}
        products={discountList}
        discountId={discountId}
        onSave={(selectedProducts) => {
          // update selectedProducts to productDiscount list
          const selectedDiscount = listDiscount.find(
            (batch) => batch.isSelected
          );
          // // set selected products to selectedDiscount
          selectedDiscount.items[0].apply.productUnitId = selectedProducts.map(
            (product) => {
              if (selectedDiscount.code === product.code) {
                return {
                  id: product.id,
                  discountQuantity: product?.discountQuantity,
                  isSelected: product?.isSelected,
                };
              }
              return null;
            }
          );
          const selectedDiscountProduct = {
            ...selectedDiscount,
            discountKey:
              selectedDiscount?.id +
              "-" +
              selectedDiscount?.items[0]?.condition?.productUnitId[0],
            productUnitId:
              selectedDiscount?.items[0]?.condition?.productUnitId[0],
            code: selectedDiscount?.code,
          };
          // set selectedDiscountProduct to productDiscount, check if it's already exist in productDiscount then replace it
          const index = productDiscount.findIndex(
            (item) => item.code === selectedDiscountProduct.code
          );
          if (index !== -1) {
            setProductDiscount([
              ...productDiscount.slice(0, index),
              selectedDiscountProduct,
              ...productDiscount.slice(index + 1),
            ]);
          } else {
            setProductDiscount([...productDiscount, selectedDiscountProduct]);
          }
          // check product before save

          setDiscountType("product");
          onSave(selectedDiscountProduct);
        }}
      /> */}
    </CustomModal>
  );
}
