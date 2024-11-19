import type { ColumnsType } from "antd/es/table";
import { cloneDeep, orderBy } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import CloseIcon from "@/assets/closeWhiteIcon.svg";
import DiscountIcon from "@/assets/gift.svg";
import RemoveIcon from "@/assets/removeIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import InputError from "@/components/InputError";
import { formatMoney, formatNumber, roundNumber } from "@/helpers";
import { branchState, discountState, orderActiveState, orderState, productDiscountSelected } from "@/recoil/state";

import { getDiscountConfig, getDiscountCount, getProductDiscountList } from "@/api/discount.service";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, message } from "antd";
import { ListBatchModal } from "./ListBatchModal";
import { ProductDiscountModal } from "./ProductDiscountModal";
import { checkTypeOrder } from "./checkTypeOrder";
import type { IBatch, IProductUnit, ISaleProductLocal } from "./interface";
import { ProductTableStyled } from "./styled";
import WarningDiscountModal from "./WarningDiscountModal";

/**
 * Component for displaying and managing a list of products in a sales order.
 *
 * @param {Object} props - The component props.
 * @param {any} props.useForm - The form handling object.
 * @param {any} props.orderDetail - The details of the current order.
 * @param {any} props.listDiscount - The list of available discounts.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @component
 * @example
 * const useForm = ...;
 * const orderDetail = ...;
 * const listDiscount = ...;
 * return <ProductList useForm={useForm} orderDetail={orderDetail} listDiscount={listDiscount} />;
 */
export function ProductList({
  useForm,
  orderDetail,
  listDiscount,
  useFormReturn,
}: {
  useForm: any;
  orderDetail: any;
  listDiscount: any;
  useFormReturn: any;
}) {
  const { errors, setError, getValues } = useForm;
  const { errorsReturn, setErrorReturn } = useFormReturn;
  const branchId = useRecoilValue(branchState);
  const [orderObject, setOrderObject] = useRecoilState(orderState);
  const [discountObject, setDiscountObject] = useRecoilState(discountState);
  const orderActive = useRecoilValue(orderActiveState);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [openProductDiscountList, setOpenProductDiscountList] = useState(false);
  const [itemDiscount, setItemDiscount] = useState();
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();
  const [productUnitSelected, setProductUnitSelected] = useState<number>();
  const [productDiscountCount, setProductDiscountCount] = useState<number>(0);
  const [openWarningDiscount, setOpenWarningDiscount] = useState(false);
  const [selectedProductDiscount, setSelectedProductDiscount] = useState();

  const checkDisplayListBatch = (product: ISaleProductLocal) => {
    return product.product.isBatchExpireControl;
  };
  const isSaleReturn = orderActive.split("-")[1] === "RETURN";
  const { data: discountConfigDetail, isLoading } = useQuery(["DISCOUNT_CONFIG"], () => getDiscountConfig());

  useEffect(() => {
    if (orderObject[orderActive]) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal, index) => {
        let newProduct;
        if (checkDisplayListBatch(product)) {
          expandedRowKeysClone[index] = true;
        }
        newProduct = {
          ...product,
          batches: product.batches?.map((batch) => ({
            ...batch,
            inventory: Math.floor(batch.inventory),
            newInventory: Math.floor(+batch.originalInventory / +product.productUnit.exchangeValue),
          })),
        };
        return newProduct;
      });
      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [orderObject, orderActive]);
  useEffect(() => {
    if (orderObject[orderActive]?.length > 0 && isSaleReturn) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      orderObject[orderActive].forEach((product, index) => {
        if (isSaleReturn && product.batches.length > 0) {
          expandedRowKeysClone[index] = true;
        }
      });
      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [orderObject, orderActive]);

  const onChangeQuantity = async (productKey, newValue, product?: any) => {
    const orderObjectClone = cloneDeep(orderObject);
    const res = await getProductDiscountList(
      {
        productUnitId: product?.id,
        branchId: branchId,
        quantity: newValue,
      },
      undefined,
      "OFFLINE",
    );
    let itemDiscountProduct = res?.data?.data?.items;
    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          itemDiscountProduct,
          quantity: newValue,
        };
      }
      return product;
    });

    // reset khuyến mại
    setDiscountObject({
      [orderActive]: {
        productDiscount: [],
        orderDiscount: [],
      },
    });
    setOrderObject(orderObjectClone);
  };
  const onExpandMoreBatches = async (productKey, quantity: number, product?: any) => {
    const orderObjectClone = cloneDeep(orderObject);
    // Process products and call API if needed
    orderObjectClone[orderActive] = await Promise.all(
      orderObjectClone[orderActive].map(async (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          let sumQuantity = 0;
          let batches = cloneDeep(product.batches);
          batches = orderBy(batches, ["isSelected"], ["desc"]);
          // Update batches and optionally call API
          batches = await Promise.all(
            batches.map(async (batch) => {
              const remainQuantity = roundNumber(quantity) - roundNumber(sumQuantity);

              if (remainQuantity && batch.inventory) {
                const tempQuantity = batch.inventory <= remainQuantity ? batch.inventory : roundNumber(remainQuantity);
                sumQuantity += tempQuantity;
                return {
                  ...batch,
                  quantity: tempQuantity,
                  isSelected: true,
                };
              }

              return { ...batch, quantity: 0, isSelected: false };
            }),
          );

          // Example: Call API here if needed
          // const res = await getProductDiscountList({
          //   productUnitId: product?.id,
          //   branchId: branchId,
          //   quantity: quantity, // Use tempQuantity or a suitable value
          // });

          // const itemDiscountProduct = res?.data?.data?.items;

          return {
            ...product,
            quantity,
            batches,
          };
        }

        return product;
      }),
    );

    setOrderObject(orderObjectClone);
  };

  useEffect(() => {
    setErrorReturn("products", { message: undefined });
  }, [orderActive]);
  const columns: ColumnsType<ISaleProductLocal> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id, isDiscount, productUnitId, discountCode }, index) => (
        <div className="w-10 flex-shrink-0">
          <Image
            src={RemoveIcon}
            className={isDiscount ? "cursor-not-allowed" : "cursor-pointer"}
            onClick={() => {
              if (isDiscount) return;
              const orderObjectClone = cloneDeep(orderObject);
              const productsClone = orderObjectClone[orderActive] || [];
              orderObjectClone[orderActive] = productsClone.filter((product) => {
                if (isDiscount) {
                  return product.id !== id;
                }
                return product.productUnitId !== productUnitId;
              });
              setOrderObject(orderObjectClone);

              // remove productDiscount if this product is in productDiscount
              const discountObjectClone = cloneDeep(discountObject);
              discountObjectClone[orderActive].productDiscount = discountObjectClone[
                orderActive
              ].productDiscount.filter((item) => item.productUnitSelected !== productUnitId);
              // reset orderDiscount
              discountObjectClone[orderActive].orderDiscount = [];
              setDiscountObject(discountObjectClone);
              if (errorsReturn?.products[index]?.quantity) {
                setErrorReturn(`products.${index}.quantity`, undefined);
              }
            }}
            alt=""
          />
        </div>
      ),
    },
    {
      title: "MÃ SKU",
      dataIndex: "code",
      key: "code",
      render: (_, { productUnit }) => productUnit.code,
    },
    {
      title: "TÊN SẢN PHẨM",
      dataIndex: "name",
      key: "name",
      className: "min-w-[200px]",
      render: (_, { product, batches, isDiscount, itemDiscountProduct, productUnitId }) => {
        return (
          <div className="flex flex-col">
            <div className=" font-medium flex gap-2 items-center w-full">
              <span>{product.name}</span>
              {isDiscount && <span className="text-red-500 px-2  bg-[#fde6f8] rounded">KM</span>}
              {itemDiscountProduct?.length > 0 && !isDiscount && (
                <div className="cursor-pointer w-5 h-5 flex-shrink-0 block">
                  <Image
                    src={DiscountIcon}
                    onClick={() => {
                      if (
                        discountObject[orderActive]?.orderDiscount?.length > 0 &&
                        !discountConfigDetail?.data?.data?.isMergeDiscount
                      ) {
                        message.error("Bạn đã chọn khuyến mại hóa đơn. Mỗi hóa đơn chỉ được chọn 1 loại khuyến mại");
                        return;
                      }
                      setOpenProductDiscountList(!openProductDiscountList);
                      setItemDiscount(itemDiscountProduct);
                      setProductUnitSelected(productUnitId);
                    }}
                    alt="discount-icon"
                  />
                </div>
              )}
            </div>
            {product?.productDosage && (
              <div className="font-medium italic text-[#0070F4]">Liều dùng: {product?.productDosage?.name}</div>
            )}
          </div>
        );
      },
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "units",
      key: "units",
      render: (_, { productKey, product, productUnitId, productUnit, isDiscount }) => (
        <CustomUnitSelect
          options={(() => {
            const productUnitKeysSelected = orderObject[orderActive]?.map((product: ISaleProductLocal) =>
              Number(product.productKey?.split("-")[1]),
            );

            return (
              product?.productUnit?.map((unit) => ({
                value: unit.id,
                label: unit.unitName,
                disabled: productUnitKeysSelected.includes(unit.id),
              })) ||
              [productUnit].map((unit) => ({
                value: unit.id,
                label: unit.unitName,
                disabled: productUnitKeysSelected.includes(unit.id),
              }))
            );
          })()}
          value={productUnitId}
          disabled={isSaleReturn || isDiscount ? true : false}
          onChange={(value) => {
            const orderObjectClone = cloneDeep(orderObject);

            orderObjectClone[orderActive] =
              orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
                if (product.productKey === productKey) {
                  const unit = product.product.productUnit.find((unit) => unit.id === value) as IProductUnit;

                  return {
                    ...product,
                    productKey: `${product.product.id}-${value}`,
                    productUnitId: value,
                    productUnit: unit,
                    // exchangeValue: unit.exchangeValue,
                    newInventory: Math.floor(product.product.quantity / unit.exchangeValue),
                    batches: product.batches?.map((batch) => ({
                      ...batch,
                      inventory: Math.floor(batch.quantity),
                      newInventory: Math.floor(batch.originalInventory / unit.exchangeValue),
                    })),
                  };
                }

                return product;
              }) ?? [];

            setOrderObject(orderObjectClone);
          }}
        />
      ),
    },
    ...(isSaleReturn
      ? []
      : [
          {
            title: "TỒN KHO",
            dataIndex: "newInventory",
            key: "newInventory",
            render: (value, record) => (
              <div>{value ? formatNumber(Math.floor(value)) : formatNumber(record.inventory)}</div>
            ),
          },
        ]),
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record: any, index) => (
        <div>
          <CustomInput
            wrapClassName="!w-[110px]"
            className="!h-6 !w-[80px] text-center"
            hasMinus={true}
            hasPlus={true}
            value={isNaN(quantity) ? 0 : quantity}
            type="number"
            disabled={
              // (isSaleReturn && record?.batches?.length > 0) ||
              record?.isDiscount && !record?.buyNumberType ? true : false
            }
            onChange={(value) => {
              // validate discount
              if (record?.isDiscount && !record?.buyNumberType) return;
              // validate trả hàng
              if (isSaleReturn && record?.batches?.length > 0) {
                setProductKeyAddBatch(record?.productKey);
                setOpenListBatchModal(true);
                return;
              }
              if (isSaleReturn && record?.batches?.length <= 0) {
                if (record?.quantityLast) {
                  if (value > record?.quantityLast) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                } else {
                  if (value > +record?.originalQuantity) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                }
              } else {
                setErrorReturn(`products.${index}.quantity`, undefined);
              }
              // logic update quantity
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
              setOrderObject(orderObjectClone);
              onChangeQuantity(record?.productKey, value, record);
            }}
            onMinus={async (value) => {
              if (record?.isDiscount && !record?.buyNumberType) return;
              if (isSaleReturn && record?.batches?.length > 0) {
                setProductKeyAddBatch(record?.productKey);
                setOpenListBatchModal(true);
                return;
              }
              if (isSaleReturn && record?.batches?.length <= 0) {
                if (record?.quantityLast) {
                  if (value > record?.quantityLast) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                } else {
                  if (value > +record?.originalQuantity) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                }
              } else {
                setErrorReturn(`products.${index}.quantity`, undefined);
              }
              // await onExpandMoreBatches(record?.productKey, value, record);
              onChangeQuantity(record?.productKey, value, record);
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
              setOrderObject(orderObjectClone);
            }}
            onPlus={async (value) => {
              if (record?.isDiscount && !record?.buyNumberType) return;
              if (isSaleReturn && record?.batches?.length > 0) {
                setProductKeyAddBatch(record?.productKey);
                setOpenListBatchModal(true);
                return;
              }
              if (isSaleReturn && record?.batches?.length <= 0) {
                if (record?.quantityLast) {
                  if (value > record?.quantityLast) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                } else {
                  if (value > +record?.originalQuantity) {
                    setErrorReturn(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    onChangeQuantity(record?.productKey, value, record);
                    return;
                  }
                  setErrorReturn(`products.${index}.quantity`, undefined);
                }
              } else {
                setErrorReturn(`products.${index}.quantity`, undefined);
              }
              onChangeQuantity(record?.productKey, value, record);
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
              setOrderObject(orderObjectClone);
            }}
            onBlur={(e: any) => {
              if (record?.isDiscount && !record?.buyNumberType) return;
              if (isSaleReturn && record?.batches?.length > 0) {
                setProductKeyAddBatch(record?.productKey);
                setOpenListBatchModal(true);
                return;
              }
              if (isSaleReturn && record?.batches?.length <= 0) {
                if (record?.quantityLast) {
                  if (+e.target.value > record?.quantityLast) {
                    setError(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    return;
                  }
                  setError(`products.${index}.quantity`, {
                    type: "manual",
                    message: undefined,
                  });
                  onChangeQuantity(record?.productKey, +e.target.value, record);
                } else {
                  if (+e.target.value > +record?.originalQuantity) {
                    setError(`products.${index}.quantity`, {
                      type: "manual",
                      message: "Số lượng trả vượt quá số lượng đã mua",
                    });
                    return;
                  }
                  setError(`products.${index}.quantity`, {
                    type: "manual",
                    message: undefined,
                  });
                  onChangeQuantity(record?.productKey, +e.target.value, record);
                }
              }
              // clear productDiscount if this product is in productDiscount
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
              setOrderObject(orderObjectClone);
              onExpandMoreBatches(record?.productKey, Number(e.target.value), record);
            }}
          />
          {isSaleReturn && errorsReturn?.products && (
            <InputError error={errorsReturn.products[index]?.quantity?.message || ""} />
          )}
        </div>
      ),
    },
    ...(isSaleReturn
      ? [
          {
            title: "GIÁ TRẢ",
            dataIndex: "price",
            key: "price",
            render: (_, { productUnit, productKey }) => (
              // input return price
              <CustomInput
                wrapClassName="!w-[110px]"
                className="!h-6 !w-[80px] text-center"
                hasMinus={false}
                hasPlus={false}
                value={checkTypeOrder(orderDetail?.order?.code) ? productUnit?.marketPrice : productUnit.returnPrice}
                type="number"
                onChange={(value) => {
                  const orderObjectClone = cloneDeep(orderObject);

                  orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
                    if (product.productKey === productKey) {
                      return {
                        ...product,
                        productUnit: {
                          ...product.productUnit,
                          ...(checkTypeOrder(orderDetail?.order?.code)
                            ? { marketPrice: value }
                            : { returnPrice: value }),
                        },
                      };
                    }
                    return product;
                  });
                  setOrderObject(orderObjectClone);
                }}
              />
            ),
          },
        ]
      : []),
    {
      title: "ĐƠN GIÁ",
      dataIndex: "price",
      key: "price",
      render: (_, { productUnit, buyNumberType }) => (
        <span>
          {/* {productUnit?.oldPrice && (
            <span className="text-[#828487] line-through mr-2">{formatMoney(productUnit.oldPrice)}</span>
          )} */}
          {formatMoney(checkTypeOrder(orderDetail?.order?.code) ? productUnit?.marketPrice : productUnit.price)}
        </span>
      ),
    },
    {
      title: "KM",
      dataIndex: "price",
      key: "price",
      render: (_, { price, discountValue, discountType, isDiscount, buyNumberType, pointValue }) => (
        <div>
          {discountValue > 0 && (
            <div className="flex flex-col">
              <span className="text-[#ef4444]">{formatMoney(discountValue)}</span>
            </div>
          )}
          {Number(pointValue) > 0 && (
            <div className="flex flex-col">
              <span className="text-[#ef4444]">{formatNumber(pointValue)} điểm</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "THÀNH TIỀN",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice, { quantity, productUnit, isDiscount, price, isDiscountPrice }) =>
        orderDetail ? (
          formatMoney(
            checkTypeOrder(orderDetail?.order?.code)
              ? productUnit?.marketPrice * quantity
              : Number(productUnit.returnPrice) * quantity,
          )
        ) : isDiscount || isDiscountPrice ? (
          <div className="flex flex-col">{formatMoney(price * quantity)}</div>
        ) : (
          formatMoney(productUnit.price * quantity)
        ),
    },
  ];
  const handleRemoveBatch = (productKey: string, batchId: number) => {
    const orderObjectClone = cloneDeep(orderObject);
    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          batches: product.batches?.map((batch) => {
            if (batch.batchId === batchId) {
              return {
                ...batch,
                quantity: 0,
                isSelected: false,
              };
            }
            return batch;
          }),
        };
      }
      return product;
    });
    // caculate quantity
    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          quantity: product.batches.reduce((acc, obj) => acc + (obj.isSelected ? obj.quantity : 0), 0),
        };
      }
      return product;
    });
    setOrderObject(orderObjectClone);
  };

  const onSaveProductDiscount = (selectedDiscount) => {
    const discountObjectClone = cloneDeep(discountObject);
    const index = discountObjectClone[orderActive]?.productDiscount?.findIndex(
      (item) => item?.productUnitSelected === selectedDiscount.productUnitSelected,
    );
    if (index !== -1) {
      discountObjectClone[orderActive].productDiscount[index] = selectedDiscount;
    } else {
      discountObjectClone[orderActive].productDiscount.push(selectedDiscount);
    }
    setDiscountObject(discountObjectClone);
    setOpenProductDiscountList(false);
  };

  return (
    <ProductTableStyled className="p-4">
      <CustomTable
        dataSource={orderObject[orderActive]?.map((product, index) => ({
          ...product,
          key: index + 1,
        }))}
        columns={columns}
        pagination={false}
        scroll={{ x: 900 }}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: (record: ISaleProductLocal) =>
            isSaleReturn && record?.batches?.length > 0 ? (
              <div>
                <div className="bg-[#FFF3E6] px-6 py-2 ">
                  <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
                    <div className="flex items-center gap-x-3">
                      <div
                        className="min-w-fit cursor-pointer pl-1 font-medium text-[#0070F4]"
                        onClick={() => {
                          setProductKeyAddBatch(record.productKey);
                          setOpenListBatchModal(true);
                        }}
                      >
                        Chọn lô
                      </div>
                      {record?.batches?.map(
                        (batch: any) =>
                          batch &&
                          batch.isSelected && (
                            <div
                              key={batch.batchId}
                              className="flex min-w-fit items-center rounded bg-red-main py-1 px-2 text-white"
                            >
                              <span className="mr-2">
                                {batch.batch?.name} - {batch?.batch?.expiryDate} - SL: {batch.quantity}
                              </span>
                              <Image
                                className=" cursor-pointer"
                                src={CloseIcon}
                                onClick={() => {
                                  handleRemoveBatch(record.productKey, batch.batchId);
                                }}
                                alt=""
                              />
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {checkDisplayListBatch(record) && (
                  <div className="bg-[#FFF3E6] px-6 py-2 ">
                    <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
                      <div className="flex items-center gap-x-3">
                        <div
                          className="min-w-fit cursor-pointer pl-1 font-medium text-[#0070F4]"
                          onClick={() => {
                            setProductKeyAddBatch(record.productKey);
                            setOpenListBatchModal(true);
                          }}
                        >
                          Chọn lô
                        </div>

                        {record?.batches?.map(
                          (batch) =>
                            batch.isSelected && (
                              <div
                                key={batch.batchId}
                                className="flex min-w-fit items-center rounded bg-red-main py-1 px-2 text-white"
                              >
                                <span className="mr-2">
                                  {batch.name} - {batch.expiryDate} - SL: {batch.quantity}
                                </span>{" "}
                                <Image
                                  className=" cursor-pointer"
                                  src={CloseIcon}
                                  onClick={() => {
                                    handleRemoveBatch(record.productKey, batch.batchId);
                                  }}
                                  alt=""
                                />
                              </div>
                            ),
                        )}
                      </div>
                      <InputError
                        error={
                          errors?.products
                            ? errors?.products[Number(record.key) - 1]?.batches?.message ||
                              errors?.products[Number(record.key) - 1]?.batches[0]?.quantity?.message
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />
      <ListBatchModal
        key={openListBatchModal ? 1 : 0}
        isOpen={!!openListBatchModal}
        onCancel={() => setOpenListBatchModal(false)}
        productKeyAddBatch={productKeyAddBatch}
        onSave={(listBatch: IBatch[]) => {
          const orderObjectClone = cloneDeep(orderObject);
          orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
            if (product.productKey === productKeyAddBatch) {
              return {
                ...product,
                quantity: listBatch.reduce((acc, obj) => acc + (obj.isSelected ? obj.quantity : 0), 0),
                batches: listBatch,
              };
            }

            return product;
          });
          setOrderObject(orderObjectClone);
          setError("products", { message: undefined });
        }}
      />
      <ProductDiscountModal
        isOpen={openProductDiscountList}
        onCancel={() => setOpenProductDiscountList(false)}
        onSave={async (selectedDiscount) => {
          setSelectedProductDiscount(selectedDiscount);
          // check warning
          if (getValues("customerId") && selectedDiscount && selectedDiscount?.time?.isWarning) {
            const res = await getDiscountCount(selectedDiscount?.id, getValues("customerId"));
            if (+res?.data?.data?.count > 0) {
              setProductDiscountCount(+res?.data?.data?.count);
              setOpenWarningDiscount(true);
              return;
            }
          }
          onSaveProductDiscount(selectedDiscount);
        }}
        discountList={itemDiscount}
        productUnitSelected={productUnitSelected}
      />

      <WarningDiscountModal
        isOpen={openWarningDiscount}
        onCancel={() => setOpenWarningDiscount(false)}
        onSave={() => {
          onSaveProductDiscount(selectedProductDiscount);
          setOpenWarningDiscount(false);
        }}
        count={productDiscountCount}
        type="product"
      />
    </ProductTableStyled>
  );
}
