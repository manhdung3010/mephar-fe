import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, orderBy } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CloseIcon from '@/assets/closeWhiteIcon.svg';
import DiscountIcon from '@/assets/gift.svg';
import RemoveIcon from '@/assets/removeIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { CustomUnitSelect } from '@/components/CustomUnitSelect';
import InputError from '@/components/InputError';
import { formatMoney, formatNumber, roundNumber } from '@/helpers';
import { branchState, discountTypeState, orderActiveState, orderDiscountSelected, orderState, productDiscountSelected } from '@/recoil/state';

import { Tooltip, message } from 'antd';
import { ListBatchModal } from './ListBatchModal';
import { ProductDiscountModal } from './ProductDiscountModal';
import type { IBatch, IProductUnit, ISaleProductLocal } from './interface';
import { ProductTableStyled } from './styled';
import { getDiscountConfig, getProductDiscountList } from '@/api/discount.service';
import { useQuery } from '@tanstack/react-query';

export function ProductList({ useForm, orderDetail, listDiscount }: { useForm: any, orderDetail: any, listDiscount: any }) {
  const { errors, setError } = useForm;

  const [orderObject, setOrderObject] = useRecoilState(orderState);
  const orderActive = useRecoilValue(orderActiveState);
  const [orderDiscount, setOrderDiscount] = useRecoilState(orderDiscountSelected);
  const [productDiscount, setProductDiscount] = useRecoilState(productDiscountSelected);
  const [discountType, setDiscountType] = useRecoilState(discountTypeState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [openProductDiscountList, setOpenProductDiscountList] = useState(false);
  const [itemDiscount, setItemDiscount] = useState();
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();

  const checkDisplayListBatch = (product: ISaleProductLocal) => {
    return product.product.isBatchExpireControl
  };
  const branchId = useRecoilValue(branchState);

  const isSaleReturn = orderActive.split("-")[1] === "RETURN";

  const { data: discountConfigDetail, isLoading } = useQuery(
    ['DISCOUNT_CONFIG'],
    () => getDiscountConfig()
  );

  useEffect(() => {
    if (orderObject[orderActive]) {
      const expandedRowKeysClone = { ...expandedRowKeys };

      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
        (product: ISaleProductLocal, index) => {
          let newProduct
          if (checkDisplayListBatch(product)) {
            expandedRowKeysClone[index] = true;
          }
          newProduct = {
            ...product, batches: product.batches?.map((batch) => ({
              ...batch,
              inventory: Math.floor(batch.inventory),
              newInventory: Math.floor(batch.originalInventory / product.productUnit.exchangeValue),
            }))
          }

          return newProduct;
        }
      );
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

    const res = await getProductDiscountList({ productUnitId: product?.id, branchId: branchId, quantity: newValue })
    let itemDiscountProduct = res?.data?.data?.items

    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          return {
            ...product,
            itemDiscountProduct,
            quantity: newValue,
          };
        }

        return product;
      }
    );

    setOrderObject(orderObjectClone);
  };
  const onExpandMoreBatches = async (productKey, quantity: number, product?: any) => {
    const orderObjectClone = cloneDeep(orderObject);

    const res = await getProductDiscountList({ productUnitId: product?.id, branchId: branchId, quantity: quantity })
    let itemDiscountProduct = res?.data?.data?.items

    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          return {
            ...product,
            itemDiscountProduct,
            quantity,
          };
        }

        return product;
      }
    );

    orderObjectClone[orderActive] = orderObjectClone[orderActive].map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          let sumQuantity = 0;

          let batches = cloneDeep(product.batches);
          batches = orderBy(batches, ['isSelected'], ['desc']);

          batches = batches.map((batch) => {
            const remainQuantity =
              roundNumber(quantity) - roundNumber(sumQuantity);

            if (remainQuantity && batch.inventory) {
              const tempQuantity =
                batch.inventory <= remainQuantity
                  ? batch.inventory
                  : roundNumber(remainQuantity);

              sumQuantity += tempQuantity;

              return {
                ...batch,
                quantity: tempQuantity,
                isSelected: true,
              };
            }

            return { ...batch, quantity: 0, isSelected: false };
          });

          return {
            ...product,
            batches,
          };
        }

        return product;
      }
    );

    setOrderObject(orderObjectClone);
  };
  const columns: ColumnsType<ISaleProductLocal> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id, isDiscount, productUnitId }) => (
        <div className='w-10 flex-shrink-0'>
          <Image
            src={RemoveIcon}
            className={'cursor-pointer'}
            onClick={() => {
              // if (isDiscount) return
              const orderObjectClone = cloneDeep(orderObject);
              const productsClone = orderObjectClone[orderActive] || [];
              orderObjectClone[orderActive] = productsClone.filter(
                (product) => {
                  if (isDiscount) return product.id !== id
                  return product.productUnitId !== productUnitId
                }
              );
              setOrderDiscount([])
              setProductDiscount([])
              setDiscountType("order")
              setOrderObject(orderObjectClone);
            }}
            alt=""
          />
        </div>
      ),
    },
    {
      title: 'MÃ SKU',
      dataIndex: 'code',
      key: 'code',
      render: (_, { productUnit }) => productUnit.code,
    },
    {
      title: 'TÊN SẢN PHẨM',
      dataIndex: 'name',
      key: 'name',
      render: (_, { product, batches, isDiscount, itemDiscountProduct }) => (
        <div>
          <div className=" font-medium flex gap-2 items-center">
            {product.name}
            {
              isDiscount && <span className="text-red-500 px-2  bg-[#fde6f8] rounded">KM</span>
            }
            {
              itemDiscountProduct?.length > 0 && (
                <Tooltip title="KM hàng hóa" className='cursor-pointer'>
                  <Image src={DiscountIcon} onClick={() => {
                    if (orderDiscount?.length > 0 && !discountConfigDetail?.data?.data?.isMergeDiscount) {
                      message.error("Bạn đã chọn khuyến mại hóa đơn. Mỗi hóa đơn chỉ được chọn 1 loại khuyến mại")
                    }
                    else {
                      setOpenProductDiscountList(!openProductDiscountList)
                      setItemDiscount(itemDiscountProduct)
                    }
                  }} alt='discount-icon' />
                </Tooltip>
              )
            }
          </div>
          {/* <div className="cursor-pointer font-medium text-[#0070F4]">
            {batches?.length ? 'Lô sản xuất' : ''}
          </div> */}
          {/* <div>
            test2 - {' '}
            <span className="font-medium italic text-[#828487]">
              {warningExpiryDate}
            </span>{' '}
            - (tồn {inventory})
          </div> */}
          {/* <div className="font-medium italic text-[#0070F4]">Liều dùng</div> */}
        </div>
      ),
    },
    {
      title: 'ĐƠN VỊ',
      dataIndex: 'units',
      key: 'units',
      render: (_, { productKey, product, productUnitId, productUnit, isDiscount }) => (
        <CustomUnitSelect
          options={(() => {
            const productUnitKeysSelected = orderObject[orderActive]?.map(
              (product: ISaleProductLocal) =>
                Number(product.productKey?.split('-')[1])
            );

            return product?.productUnit?.map((unit) => ({
              value: unit.id,
              label: unit.unitName,
              disabled: productUnitKeysSelected.includes(unit.id),
            })) || [productUnit].map((unit) => ({
              value: unit.id,
              label: unit.unitName,
              disabled: productUnitKeysSelected.includes(unit.id),
            }));
          })()}
          value={productUnitId}
          disabled={isSaleReturn || isDiscount ? true : false}
          onChange={(value) => {
            const orderObjectClone = cloneDeep(orderObject);

            orderObjectClone[orderActive] =
              orderObjectClone[orderActive]?.map(
                (product: ISaleProductLocal) => {
                  if (product.productKey === productKey) {
                    const unit = product.product.productUnit.find(
                      (unit) => unit.id === value
                    ) as IProductUnit;

                    return {
                      ...product,
                      productKey: `${product.product.id}-${value}`,
                      productUnitId: value,
                      productUnit: unit,
                      // exchangeValue: unit.exchangeValue,
                      newInventory: Math.floor(product.product.quantity / unit.exchangeValue),
                      batches: product.batches?.map((batch) => ({
                        ...batch,
                        inventory:
                          (Math.floor(batch.quantity)),
                        newInventory: (Math.floor(batch.originalInventory / unit.exchangeValue)),
                      })),
                    };
                  }

                  return product;
                }
              ) ?? [];

            setOrderObject(orderObjectClone);
          }}
        />
      ),
    },
    ...(
      isSaleReturn ? [] : [{
        title: 'TỒN KHO',
        dataIndex: 'newInventory',
        key: 'newInventory',
        render: (value, record) => <div>
          {value ? formatNumber(Math.floor(value)) : formatNumber(record.inventory)}

        </div>
      },]
    ),
    {
      title: 'SỐ LƯỢNG',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <CustomInput
          wrapClassName="!w-[110px]"
          className="!h-6 !w-[80px] text-center"
          hasMinus={true}
          hasPlus={true}
          value={isNaN(quantity) ? 0 : quantity}
          type="number"
          disabled={(isSaleReturn && record?.batches?.length > 0) || record?.isDiscount && !record?.buyNumberType ? true : false}
          onChange={(value) => {
            if (record?.isDiscount && !record?.buyNumberType) return
            if (isSaleReturn && record?.batches?.length > 0) {
              setProductKeyAddBatch(record?.productKey);
              setOpenListBatchModal(true);
              return;
            }

            // remove productDiscount if this product is in productDiscount
            const productDiscountClone = cloneDeep(productDiscount)
            productDiscountClone.forEach((item, index) => {
              if (item.productUnitId === record?.productUnitId) {
                // remove this item from productDiscount
                productDiscountClone.splice(index, 1)
              }
            })
            setProductDiscount(productDiscountClone)
            const orderObjectClone = cloneDeep(orderObject);
            orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
            setOrderObject(orderObjectClone);

            onChangeQuantity(record?.productKey, value, record)
          }}
          onMinus={async (value) => {
            if (record?.isDiscount && !record?.buyNumberType) return
            if (isSaleReturn && record?.batches?.length > 0) {
              setProductKeyAddBatch(record?.productKey);
              setOpenListBatchModal(true);
              return;
            }

            // remove productDiscount if this product is in productDiscount
            const productDiscountClone = cloneDeep(productDiscount)
            productDiscountClone.forEach((item, index) => {
              if (item.productUnitId === record?.productUnitId) {
                // remove this item from productDiscount
                productDiscountClone.splice(index, 1)
              }
            })
            setProductDiscount(productDiscountClone)
            const orderObjectClone = cloneDeep(orderObject);
            orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
            setOrderObject(orderObjectClone);
            await onExpandMoreBatches(record?.productKey, value, record);
          }}
          onPlus={async (value) => {
            if (record?.isDiscount && !record?.buyNumberType) return
            if (isSaleReturn && record?.batches?.length > 0) {
              setProductKeyAddBatch(record?.productKey);
              setOpenListBatchModal(true);
              return;
            }
            // remove productDiscount if this product is in productDiscount
            const productDiscountClone = cloneDeep(productDiscount)
            productDiscountClone.forEach((item, index) => {
              if (item.productUnitId === record?.productUnitId) {
                // remove this item from productDiscount
                productDiscountClone.splice(index, 1)
              }
            })
            setProductDiscount(productDiscountClone)
            const orderObjectClone = cloneDeep(orderObject);
            orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
            setOrderObject(orderObjectClone);
            await onExpandMoreBatches(record?.productKey, value, record);
          }}
          onBlur={(e) => {
            if (record?.isDiscount && !record?.buyNumberType) return
            if (isSaleReturn && record?.batches?.length > 0) {
              setProductKeyAddBatch(record?.productKey);
              setOpenListBatchModal(true);
              return;
            }
            // remove productDiscount if this product is in productDiscount
            const productDiscountClone = cloneDeep(productDiscount)
            productDiscountClone.forEach((item, index) => {
              if (item.productUnitId === record?.productUnitId) {
                // remove this item from productDiscount
                productDiscountClone.splice(index, 1)
              }
            })
            setProductDiscount(productDiscountClone)
            const orderObjectClone = cloneDeep(orderObject);
            orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
            setOrderObject(orderObjectClone);
            onExpandMoreBatches(record?.productKey, Number(e.target.value), record)
          }
          }
        />
      ),
    },
    ...(isSaleReturn ? [
      {
        title: 'GIÁ TRẢ',
        dataIndex: 'price',
        key: 'price',
        render: (_, { productUnit, productKey }) => (
          // input return price
          <CustomInput
            wrapClassName="!w-[110px]"
            className="!h-6 !w-[80px] text-center"
            hasMinus={false}
            hasPlus={false}
            value={productUnit.returnPrice}
            type="number"
            onChange={(value) => {
              const orderObjectClone = cloneDeep(orderObject);

              orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
                (product: ISaleProductLocal) => {
                  if (product.productKey === productKey) {
                    return {
                      ...product,
                      productUnit: {
                        ...product.productUnit,
                        returnPrice: value,
                      },
                    };
                  }

                  return product;
                }
              );

              setOrderObject(orderObjectClone);
            }} />
        ),
      },
    ] : []),
    {
      title: 'ĐƠN GIÁ',
      dataIndex: 'price',
      key: 'price',
      render: (_, { productUnit, buyNumberType }) => <span>
        {formatMoney(productUnit.price)}
        {productUnit?.oldPrice && buyNumberType === 1 && <span className='text-[#828487] line-through ml-2'>{"("}Giá cũ: {formatMoney(productUnit.oldPrice)}{")"}</span>}
      </span>,
    },
    {
      title: 'KM',
      dataIndex: 'price',
      key: 'price',
      render: (_, { price, discountValue, discountType, isDiscount, buyNumberType }) => discountValue > 0 && buyNumberType !== 1 && (
        <div className='flex flex-col'>
          <span className='text-[#ef4444]'>
            {formatNumber(discountValue)}
            {
              discountType === "amount" ? "đ" : "%"
            }
          </span>
        </div>
      ),
    },
    {
      title: 'THÀNH TIỀN',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice, { quantity, productUnit, isDiscount, discountType, price, discountValue, isBuyByNumber, buyNumberType }) =>
        orderDetail ? formatMoney(Number(productUnit.returnPrice) * quantity) : isDiscount && !buyNumberType ? (
          <div className='flex flex-col'>
            {discountType === "percent" ? `${formatMoney(Number(price - (discountValue * price / 100)) * quantity)}` : formatMoney(Number((price - discountValue) * quantity))}
          </div>
        ) : buyNumberType === 1 ? formatMoney(productUnit.price * quantity) : buyNumberType === 2 ? formatMoney((productUnit?.price - discountValue) * quantity) : formatMoney(productUnit.price * quantity),
    },
  ];

  const handleRemoveBatch = (productKey: string, batchId: number) => {
    const orderObjectClone = cloneDeep(orderObject);

    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
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
      }
    );
    // caculate quantity
    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          return {
            ...product,
            quantity: product.batches.reduce(
              (acc, obj) => acc + (obj.isSelected ? obj.quantity : 0),
              0
            ),
          };
        }

        return product;
      }
    );
    setOrderObject(orderObjectClone);
  };

  console.log("orderObject[orderActive]", orderObject[orderActive])

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
          expandedRowRender: (record: ISaleProductLocal) => isSaleReturn && record?.batches?.length > 0 ? (
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
                        batch && batch.isSelected && (
                          <div
                            key={batch.batchId}
                            className="flex min-w-fit items-center rounded bg-red-main py-1 px-2 text-white"
                          >
                            <span className="mr-2">
                              {batch.batch?.name} - {batch?.batch?.expiryDate} - SL:{' '}
                              {batch.quantity}
                            </span>
                            <Image
                              className=" cursor-pointer"
                              src={CloseIcon}
                              onClick={() => {
                                handleRemoveBatch(
                                  record.productKey,
                                  batch.batchId
                                );
                              }}
                              alt=""
                            />
                          </div>
                        )
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
                                {batch.name} - {batch.expiryDate} - SL:{' '}
                                {batch.quantity}
                              </span>{' '}
                              <Image
                                className=" cursor-pointer"
                                src={CloseIcon}
                                onClick={() => {
                                  handleRemoveBatch(
                                    record.productKey,
                                    batch.batchId
                                  );
                                }}
                                alt=""
                              />
                            </div>
                          )
                      )}
                    </div>
                    <InputError
                      error={
                        errors?.products
                          ? errors?.products[Number(record.key) - 1]?.batches
                            ?.message ||
                          errors?.products[Number(record.key) - 1]?.batches[0]
                            ?.quantity?.message
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
      {
        discountType === "order" && orderObject[orderActive]?.length > 0 && orderDiscount?.length > 0 && (
          <div className='bg-[#fbecee] rounded-lg shadow-sm p-5 mt-5'>
            <h3 className='text-lg font-medium mb-2'>Khuyến mại hóa đơn</h3>
            <div className='grid grid-cols-1 gap-2'>
              {
                orderDiscount?.map((item, index) => (
                  <div key={index} className='flex items-center gap-x-2'>
                    <div className='text-base text-[#d64457]'>{item?.name}:</div>
                    {
                      item?.type === "product_price" && (
                        <div className='text-base'>
                          Giảm giá hàng {formatNumber(item?.items[0]?.apply?.discountValue)} {item?.items[0]?.apply?.discountType === "percent" ? "%" : "đ"}
                        </div>
                      )
                    }
                    {
                      item?.type === "order_price" && (
                        <div className='text-base'>Giảm giá hóa đơn {formatNumber(item?.items[0]?.apply?.discountValue)} {item?.items[0]?.apply?.discountType === "percent" ? "%" : "đ"}</div>
                      )
                    }

                    {
                      item?.type === "gift" && (
                        <div className='text-base'>Tặng hàng</div>
                      )
                    }
                    {
                      item?.type === "loyalty" && (
                        <div className='text-base'>Tặng điểm: {formatNumber(item?.items[0]?.apply?.pointValue)}{item?.items[0]?.apply?.discountType === "percent" ? "% điểm" : "điểm"} trên tổng hóa đơn</div>
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        )
      }

      <ListBatchModal
        key={openListBatchModal ? 1 : 0}
        isOpen={!!openListBatchModal}
        onCancel={() => setOpenListBatchModal(false)}
        productKeyAddBatch={productKeyAddBatch}
        onSave={(listBatch: IBatch[]) => {
          const orderObjectClone = cloneDeep(orderObject);

          orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
            (product: ISaleProductLocal) => {
              if (product.productKey === productKeyAddBatch) {
                return {
                  ...product,
                  quantity: listBatch.reduce(
                    (acc, obj) => acc + (obj.isSelected ? obj.quantity : 0),
                    0
                  ),
                  batches: listBatch,
                };
              }

              return product;
            }
          );

          setOrderObject(orderObjectClone);
          setError('products', { message: undefined });
        }}
      />
      <ProductDiscountModal
        isOpen={openProductDiscountList}
        onCancel={() => setOpenProductDiscountList(false)}
        onSave={(selectedDiscount) => {
          // set selected discount to setValue products
          const orderObjectClone = cloneDeep(orderObject);
          orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
            (product: ISaleProductLocal) => {
              if (selectedDiscount[0]?.items[0]?.condition?.productUnitId.includes(product.productUnitId)) {
                return {
                  ...product,
                  discountSelected: selectedDiscount
                }
              }
              return product
            }
          )
          setOrderObject(orderObjectClone)
          setOpenProductDiscountList(false)
        }}
        discountList={itemDiscount}
      />
    </ProductTableStyled>
  );
}
