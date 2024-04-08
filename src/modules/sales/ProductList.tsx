import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, orderBy } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CloseIcon from '@/assets/closeWhiteIcon.svg';
import RemoveIcon from '@/assets/removeIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { CustomUnitSelect } from '@/components/CustomUnitSelect';
import InputError from '@/components/InputError';
import { EProductType } from '@/enums';
import { formatMoney, formatNumber, roundNumber } from '@/helpers';
import { orderActiveState, orderState } from '@/recoil/state';

import type { IBatch, IProductUnit, ISaleProductLocal } from './interface';
import { ListBatchModal } from './ListBatchModal';
import { ProductTableStyled } from './styled';

export function ProductList({ useForm }: { useForm: any }) {
  const { errors, setError } = useForm;

  const [orderObject, setOrderObject] = useRecoilState(orderState);
  const orderActive = useRecoilValue(orderActiveState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();

  const checkDisplayListBatch = (product: ISaleProductLocal) => {
    return (
      product.product.type === EProductType.MEDICINE ||
      (product.product.type === EProductType.PACKAGE &&
        product.product.isBatchExpireControl)
    );
  };

  useEffect(() => {
    if (orderObject[orderActive]) {
      const expandedRowKeysClone = { ...expandedRowKeys };

      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
        (product: ISaleProductLocal, index) => {
          if (checkDisplayListBatch(product)) {
            expandedRowKeysClone[index] = true;
          }

          return product;
        }
      );

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [orderObject, orderActive]);

  const onChangeQuantity = async (productKey, newValue) => {
    const orderObjectClone = cloneDeep(orderObject);

    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          return {
            ...product,
            quantity: newValue,
          };
        }

        return product;
      }
    );

    setOrderObject(orderObjectClone);
  };
  const onExpandMoreBatches = async (productKey, quantity: number) => {
    const orderObjectClone = cloneDeep(orderObject);

    orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
      (product: ISaleProductLocal) => {
        if (product.productKey === productKey) {
          return {
            ...product,
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
      render: (_, { id }) => (
        <div className='w-10 flex-shrink-0'>
          <Image
            src={RemoveIcon}
            className=" cursor-pointer"
            onClick={() => {
              const orderObjectClone = cloneDeep(orderObject);
              const productsClone = orderObjectClone[orderActive] || [];
              orderObjectClone[orderActive] = productsClone.filter(
                (product) => product.id !== id
              );

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
      render: (_, { product, batches }) => (
        <div>
          <div className=" font-medium">{product.name}</div>
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
      render: (_, { productKey, product, productUnitId, productUnit }) => (
        <CustomUnitSelect
          options={(() => {
            const productUnitKeysSelected = orderObject[orderActive]?.map(
              (product: ISaleProductLocal) =>
                Number(product.productKey.split('-')[1])
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
                      batches: product.batches?.map((batch) => ({
                        ...batch,
                        inventory:
                          (Math.floor(batch.quantity / product.productUnit.exchangeValue))
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
    {
      title: 'Tồn kho',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => <div>
        {formatNumber(record.inventory)}

      </div>
    },
    {
      title: 'SỐ LƯỢNG',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, { productKey }) => (
        <CustomInput
          wrapClassName="!w-[110px]"
          className="!h-6 !w-[80px] text-center"
          hasMinus={true}
          hasPlus={true}
          defaultValue={quantity}
          value={quantity}
          type="number"
          onChange={(value) => onChangeQuantity(productKey, value)}
          onMinus={async (value) => {
            await onExpandMoreBatches(productKey, value);
          }}
          onPlus={async (value) => {
            await onExpandMoreBatches(productKey, value);
          }}
          onBlur={(e) =>
            onExpandMoreBatches(productKey, Number(e.target.value))
          }
        />
      ),
    },
    {
      title: 'ĐƠN GIÁ',
      dataIndex: 'price',
      key: 'price',
      render: (_, { productUnit }) => formatMoney(productUnit.price),
    },
    {
      title: 'THÀNH TIỀN',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, { quantity, productUnit }) =>
        formatMoney(quantity * productUnit.price),
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
    setOrderObject(orderObjectClone);
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
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: ISaleProductLocal) => (
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
    </ProductTableStyled>
  );
}
