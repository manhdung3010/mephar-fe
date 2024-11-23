import Image from "next/image";
import { useEffect, useState } from "react";

import CloseIcon from "@/assets/closeWhiteIcon.svg";
import RemoveIcon from "@/assets/removeIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";

import { getInboundProducts, getSaleProducts } from "@/api/product.service";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import InputError from "@/components/InputError";
import { EProductType } from "@/enums";
import { formatMoney, formatNumber, getImage, hasPermission } from "@/helpers";
import { IImportProduct, IImportProductLocal } from "@/modules/products/import-product/coupon/interface";
import { branchState, productMoveState, profileState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { cloneDeep, debounce } from "lodash";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { RightContent } from "./RightContent";
import { receiveSchema, schema } from "./schema";
import { IBatch } from "@/modules/products/import-product/interface";
import { getMoveDetail } from "@/api/move";
import { useRouter } from "next/router";
import { ListBatchModal } from "./ListBatchModal";
import { ISaleProduct } from "@/modules/sales/interface";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { message } from "antd";

export function DeliveryCoupon() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const [importProducts, setImportProducts] = useRecoilState(productMoveState);
  const router = useRouter();
  const { moveId } = router.query;

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    isSale: true,
  });
  const branchId = useRecoilValue(branchState);

  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();
  const [openListBatchModal, setOpenListBatchModal] = useState<boolean>(false);
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(moveId ? receiveSchema : schema),
    mode: "onChange",
    defaultValues: moveId
      ? {
          branchId,
        }
      : {
          fromBranchId: branchId,
        },
  });
  const profile = useRecoilValue(profileState);

  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.delivery, RoleAction.create)) {
        message.error("Bạn không có quyền truy cập vào trang này");
        router.push("/transactions/delivery");
      }
    }
  }, [profile?.role?.permissions]);
  const { data: products, isLoading: isLoadingProduct } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_SALE_PRODUCT", formFilter.page, formFilter.limit, formFilter.keyword, formFilter.isSale, branchId], () =>
    getSaleProducts({ ...formFilter, branchId }),
  );

  const { data: moveDetail } = useQuery(
    ["MOVE_DETAIL", moveId],
    () => (moveId ? getMoveDetail(moveId) : Promise.resolve(null)),
    {
      enabled: !!moveId, // Only run the query if `id` is truthy
    },
  );

  // lỗi quantity + 1 mỗi khi F5
  useEffect(() => {
    if (moveDetail?.data?.items) {
      let cloneImportProducts = cloneDeep(importProducts);
      moveDetail?.data?.items?.forEach((product) => {
        const newProduct = {
          ...product,
          // productId: product.productId,
          productUnit: product.productUnit,
        };
        const localProduct: IImportProductLocal = {
          ...newProduct,
          productKey: `${product.product.id || product.productId}-${product.id}`,
          code: product.product.code,
          // inventory: product.quantity,
          productId: product.id,
          quantity: product.quantity - product.toQuantity,
          totalQuantity: product.quantity - product.toQuantity,
          price: product.price,
          // batches: id ? product.productBatchHistories : [],
        };

        if (importProducts.find((p) => p.productKey === localProduct.productKey)) {
          cloneImportProducts = cloneImportProducts.map((product) => {
            if (product.productKey === localProduct.productKey) {
              return {
                ...product,
                quantity: localProduct.quantity,
              };
            }

            return product;
          });
        } else {
          cloneImportProducts.push(localProduct);
        }
      });
      setImportProducts(cloneImportProducts);
    }
  }, [moveDetail?.data?.items]);

  useEffect(() => {
    if (importProducts) {
      const expandedRowKeysClone = { ...expandedRowKeys };

      let cloneImportProducts = cloneDeep(importProducts);
      let newImport = cloneImportProducts?.map((product, index) => {
        if (checkDisplayListBatch(product)) {
          expandedRowKeysClone[index] = true;
        }
      });
      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [importProducts]);

  const onChangeValueProduct = (productKey, field, newValue) => {
    let productImportClone = cloneDeep(importProducts);

    productImportClone = productImportClone.map((product: any) => {
      if (product.productKey === productKey) {
        if (field === "quantity" && product.batches?.length > 0) {
          return {
            ...product,
            quantity: newValue,
            batches: product.batches.map((batch) => ({
              ...batch,
              quantity: newValue,
            })),
          };
        }

        return {
          ...product,
          [field]: newValue,
        };
      }

      return product;
    });

    setImportProducts(productImportClone);
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <Image
          src={RemoveIcon}
          className=" cursor-pointer"
          onClick={() => {
            const productImportClone = cloneDeep(importProducts);
            const index = productImportClone.findIndex((product) => product.id === id);
            productImportClone.splice(index, 1);
            setImportProducts(productImportClone);
          }}
          alt=""
        />
      ),
    },
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      render: (value, { productUnit }) => <span className="cursor-pointer text-[#0070F4]">{productUnit?.code}</span>,
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
      render: (_, { product }) => <span className="font-medium">{product.name}</span>,
    },
    {
      title: "ĐVT",
      dataIndex: "units",
      key: "units",
      render: (_, { productKey, product, id, productUnit }) => (
        <CustomUnitSelect
          options={(() => {
            const productUnitKeysSelected = importProducts.map((product) => Number(product.productKey.split("-")[1]));

            return product.productUnit.map((unit) => ({
              value: unit.id,
              label: unit.unitName,
              disabled: productUnitKeysSelected.includes(unit.id),
            }));
          })()}
          disabled={moveDetail ? true : false}
          value={moveDetail ? productUnit.id : id}
          onChange={(value) => {
            let importProductsClone = cloneDeep(importProducts);
            importProductsClone = importProductsClone.map((product: any) => {
              if (product.productKey === productKey) {
                const productUnit = product.product.productUnit.find((unit) => unit.id === value);

                return {
                  ...product,
                  code: productUnit?.code || "", // Assign an empty string if productUnit.code is undefined
                  productKey: `${product.product.id}-${value}`,
                  primePrice: product.product.primePrice * productUnit.exchangeValue,
                  ...productUnit,
                  productUnitId: value,
                  newInventory: Math.floor(product.product.quantity / productUnit.exchangeValue),
                  batches: product.batches?.map((batch) => ({
                    ...batch,
                    inventory: batch.originalInventory / productUnit.exchangeValue,
                    newInventory: Math.floor(batch.originalInventory / productUnit.exchangeValue),
                  })),
                };
              }

              return product;
            });

            setImportProducts(importProductsClone);
          }}
        />
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "newInventory",
      key: "newInventory",
      render: (value) => formatNumber(value),
    },

    ...(moveDetail
      ? [
          {
            title: "SL chuyển",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
            render: (totalQuantity, { productKey }) => formatNumber(totalQuantity),
          },
        ]
      : []),
    {
      title: `SL ${moveDetail ? "nhận" : "chuyển"}`,
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, { productKey, newInventory }) => {
        return (
          <CustomInput
            wrapClassName="!w-[110px]"
            className="!h-6 !w-[80px] text-center"
            hasMinus={true}
            hasPlus={true}
            defaultValue={quantity > newInventory ? newInventory : quantity}
            value={quantity > newInventory ? newInventory : quantity}
            type="number"
            onChange={(value) => {
              onChangeValueProduct(productKey, "quantity", value);
            }}
            onMinus={(value) => onChangeValueProduct(productKey, "quantity", value)}
            onPlus={(value) => onChangeValueProduct(productKey, "quantity", value)}
          />
        );
      },
    },
    ...(moveDetail
      ? [
          {
            title: "Giá chuyển",
            dataIndex: "price",
            key: "price",
            render: (price, { productKey }) => (
              <CustomInput
                className="!w-[110px]"
                disabled={true}
                type="number"
                onChange={(value) => onChangeValueProduct(productKey, "price", value)}
                value={price}
                defaultValue={price}
              />
            ),
          },
        ]
      : [
          {
            title: "Giá chuyển",
            dataIndex: "primePrice",
            key: "primePrice",
            render: (price, { productKey }) => (
              <CustomInput
                className="!w-[110px]"
                type="number"
                onChange={(value) => onChangeValueProduct(productKey, "primePrice", value)}
                value={price}
                defaultValue={price}
              />
            ),
          },
        ]),
  ];

  const checkDisplayListBatch = (product: IImportProductLocal) => {
    return (
      product.product.type === EProductType.MEDICINE ||
      (product.product.type === EProductType.PACKAGE && product.product.isBatchExpireControl)
    );
  };

  const handleRemoveBatch = (productKey: string, batchId: number) => {
    let products = cloneDeep(importProducts);

    products = products.map((product) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          batches: product.batches?.filter((batch) => batch.id !== batchId),
        };
      }
      return product;
    });
    setImportProducts(products);
  };

  return (
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
          <div className="flex h-[72px] w-full  min-w-[800px] items-center bg-red-main px-6 py-3">
            <CustomAutocomplete
              className="!h-[48px] w-full !rounded text-base"
              prefixIcon={<Image src={SearchIcon} alt="" />}
              placeholder="Tìm kiếm hàng hóa theo mã hoặc tên"
              wrapClassName="w-full !rounded bg-white"
              disabled={moveDetail ? true : false}
              onSelect={(value) => {
                const product: IImportProduct = JSON.parse(value);
                let isSelectedUnit = true;

                const localProduct: any = {
                  ...product,
                  productKey: `${product.product.id}-${product.id}`,
                  price: product.product.price * product.exchangeValue,
                  primePrice:
                    product.product.primePrice *
                    Number(product.product.productUnit?.find((unit) => unit.id === product.id)?.exchangeValue),
                  inventory: product.quantity,
                  newInventory: Math.floor((product.product.quantity ?? 0) / product.exchangeValue),
                  quantity: 1,
                  discountValue: 0,
                  batches: product.batches?.map((batch) => {
                    const inventory = batch.quantity / product.productUnit.exchangeValue;

                    const newBatch = {
                      ...batch,
                      inventory,
                      originalInventory: batch.quantity,
                      quantity: 0,
                      isSelected: inventory >= 1 ? isSelectedUnit : false,
                    };

                    if (inventory >= 1 && isSelectedUnit) {
                      isSelectedUnit = false;
                      newBatch.quantity = 1;
                    }
                    return newBatch;
                  }),
                };

                let cloneImportProducts = cloneDeep(importProducts);

                if (importProducts.find((p) => p.productKey === localProduct.productKey)) {
                  cloneImportProducts = cloneImportProducts.map((product: any) => {
                    if (product.productKey === localProduct.productKey) {
                      return {
                        ...product,
                        realQuantity: product.realQuantity + 1,
                        batches: product.batches.map((batch) => {
                          const newBatch = {
                            ...batch,
                            // inventory,
                            // originalInventory: batch.quantity,
                            quantity: batch.isSelected ? batch.quantity + 1 : batch.quantity,
                          };

                          return newBatch;
                        }),
                      };
                    }

                    return product;
                  });
                  setImportProducts(cloneImportProducts);
                } else {
                  // cloneImportProducts.push(localProduct);
                  setImportProducts((prev) => [...prev, localProduct]);
                }
              }}
              showSearch={true}
              listHeight={512}
              onSearch={debounce((value) => {
                setFormFilter((preValue) => ({
                  ...preValue,
                  keyword: value,
                }));
              })}
              value={formFilter.keyword}
              options={products?.data?.items.map((item: any) => ({
                value: JSON.stringify(item),
                label: (
                  <div className="flex items-center gap-x-4 p-2">
                    <div className=" flex h-12 w-[68px] flex-shrink-0 items-center rounded border border-gray-300 p-[2px]">
                      {item.product.image?.path && (
                        <Image
                          src={getImage(item.product.image?.path)}
                          height={40}
                          width={68}
                          alt=""
                          objectFit="cover"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex gap-x-5">
                        <div>
                          {item.code} - {item.product.name}
                        </div>
                        <div className="rounded bg-red-main px-2 py-[2px] text-white">{item.unitName}</div>
                      </div>
                      <div>Số lượng - {item.quantity}</div>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>

        <div className=" overflow-x-auto">
          <div className="min-w-[1000px]">
            <CustomTable
              dataSource={importProducts?.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={columns}
              pagination={false}
              expandable={{
                defaultExpandAllRows: true,
                expandedRowRender: (record: any) => {
                  return (
                    <>
                      {moveDetail
                        ? record?.toBatches?.map((batch, index) => (
                            <div className="bg-[#FFF3E6] px-6 py-2 ">
                              <div className="flex items-center gap-x-3">
                                <div
                                  key={batch.id}
                                  className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                                >
                                  <span className="mr-2">
                                    {batch.batch.name} - {batch.batch.expiryDate} - SL:{" "}
                                    {moveDetail ? record?.quantity : record.fromBatches[index].quantity}
                                  </span>{" "}
                                  {/* <Image
                        className=" cursor-pointer"
                        src={CloseIcon}
                        onClick={() => {
                          handleRemoveBatch(
                            record.productKey,
                            batch.id
                          );
                        }}
                        alt=""
                      /> */}
                                </div>
                              </div>
                            </div>
                          ))
                        : checkDisplayListBatch(record) && (
                            <div className="bg-[#FFF3E6] px-6 py-2 ">
                              <div className="flex items-center gap-x-3">
                                <div
                                  className="ml-1 cursor-pointer font-medium text-[#0070F4]"
                                  onClick={() => {
                                    setProductKeyAddBatch(record.productKey);
                                    setOpenListBatchModal(true);
                                  }}
                                >
                                  Chọn lô
                                </div>

                                {record.batches?.map(
                                  (batch) =>
                                    batch.isSelected && (
                                      <div
                                        key={batch.id}
                                        className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                                      >
                                        <span className="mr-2">
                                          {batch.name} - {batch.expiryDate} - SL: {batch.quantity}
                                        </span>{" "}
                                        <Image
                                          className=" cursor-pointer"
                                          src={CloseIcon}
                                          onClick={() => {
                                            handleRemoveBatch(record.productKey, batch.id);
                                          }}
                                          alt=""
                                        />
                                      </div>
                                    ),
                                )}
                              </div>
                              <InputError
                                error={errors?.products && errors?.products[Number(record.key) - 1]?.batches?.message}
                              />
                            </div>
                          )}
                    </>
                  );
                },
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
                let importProductsClone = cloneDeep(importProducts);

                importProductsClone = importProductsClone.map((product) => {
                  if (product.productKey === productKeyAddBatch) {
                    return {
                      ...product,
                      quantity: listBatch.reduce((acc, obj) => acc + obj.quantity, 0),
                      batches: listBatch,
                    };
                  }

                  return product;
                });

                setImportProducts(importProductsClone);
                setError("products", { message: undefined });
              }}
            />
          </div>
        </div>
      </div>

      <RightContent
        useForm={{ getValues, setValue, handleSubmit, errors, reset }}
        branchId={branchId}
        moveId={moveId}
        moveDetail={moveDetail?.data}
      />
    </div>
  );
}
