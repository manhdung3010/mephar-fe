import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { cloneDeep, debounce, divide, orderBy } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

import { getSaleProducts } from "@/api/product.service";
import CloseIcon from "@/assets/closeWhiteIcon.svg";
import RemoveIcon from "@/assets/removeIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import InputError from "@/components/InputError";
import { formatMoney, getImage, hasPermission, roundNumber } from "@/helpers";
import type {
  IImportProduct,
  IImportProductLocal,
} from "@/modules/products/import-product/coupon/interface";
import { branchState, productReturnState, profileState } from "@/recoil/state";

import { getImportProductDetail } from "@/api/import-product.service";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { useRouter } from "next/router";
import type { IBatch } from "../interface";
import { ListBatchModal } from "./ListBatchModal";
import { RightContent } from "./RightContent";
import { schema } from "./schema";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { message } from "antd";
import useBarcodeScanner from "@/hooks/useBarcodeScanner";

export default function ReturnCoupon() {
  const profile = useRecoilValue(profileState);
  const branchId = useRecoilValue(branchState);

  const router = useRouter();
  const { id } = router.query;

  const [returnProducts, setReturnProducts] =
    useRecoilState(productReturnState);

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      branchId,
    },
  });

  const { data: importProductDetail, isLoading } = useQuery(
    ["IMPORT_PRODUCT_DETAIL", id],
    () => (id ? getImportProductDetail(Number(id)) : Promise.resolve(null)),
    {
      enabled: !!id, // Only run the query if `id` is truthy
    }
  );

  useEffect(() => {
    if (importProductDetail) {
      let cloneImportProducts = cloneDeep(returnProducts);
      importProductDetail?.data?.products?.forEach((product) => {
        const localProduct: IImportProductLocal = {
          ...product,
          code: product.product.code,
          productUnit: product?.productUnit,
          productKey: `${product.productId || product.productId}-${product.id}`,
          primePrice: +product.price,
          productId: product.productId,
          quantity: product.quantity,
          price: +product.price,
          discountValue: 0,
          batches: product.batches?.map((batch) => {
            const inventory =
              batch.batch.quantity / product.productUnit.exchangeValue;

            const newBatch = {
              ...batch,
              inventory,
              productUnit: product?.productUnit,
              productKey: `${product.productId || product.productId}-${product.id
                }`,
              productId: product.productId,
              id: batch.batch.id,
              batchId: batch.batch.id,
              expiryDate: batch.batch.expiryDate,
              name: batch.batch.name,
              originalInventory: batch.batch.quantity,
              saleQuantity: batch.quantity,
              quantity: batch.quantity,
              isSelected: true,
            };

            return newBatch;
          }),
        };
        if (
          returnProducts.find((p) => p.productKey === localProduct.productKey)
        ) {
          cloneImportProducts = cloneImportProducts.map((product) => {
            if (product.productKey === localProduct.productKey) {
              return {
                ...product,
                quantity: product.quantity + 1,
              };
            }

            return product;
          });
        } else {
          cloneImportProducts.push(localProduct);
        }
      });
      setReturnProducts(cloneImportProducts);
      setValue("supplierId", importProductDetail?.data?.inbound.supplierId, {
        shouldValidate: true,
      });
    }
  }, [importProductDetail]);

  useEffect(() => {
    if (profile) {
      setValue("userId", profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (branchId) {
      setValue("branchId", branchId);
    }
  }, [branchId]);

  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    isSale: true,
  });

  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: IImportProduct[] };
  }>(
    [
      "LIST_IMPORT_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      formFilter.isSale,
      branchId,
    ],
    () => getSaleProducts({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (profile?.role?.permissions) {
      if (
        !hasPermission(
          profile?.role?.permissions,
          RoleModel.return_product,
          RoleAction.create
        )
      ) {
        message.error("Bạn không có quyền truy cập vào trang này");
        router.push("/products/list");
      }
    }
  }, [profile?.role?.permissions]);

  useEffect(() => {
    if (returnProducts.length > 0) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      returnProducts.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [returnProducts?.length]);

  const onChangeValueProduct = (productKey, field, newValue) => {
    let productImportClone = cloneDeep(returnProducts);

    productImportClone = productImportClone.map((product: any) => {
      if (product.productKey === productKey) {
        if (field === "quantity" && product.batches?.length === 1) {
          return {
            ...product,
            quantity: newValue,
            batches: product.batches?.map((batch) => ({
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

    setReturnProducts(productImportClone);
  };

  const onExpandMoreBatches = async (productKey, quantity: number) => {
    let orderObjectClone = cloneDeep(returnProducts);

    orderObjectClone = orderObjectClone?.map((product: any) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          quantity,
        };
      }

      return product;
    });

    orderObjectClone = orderObjectClone.map((product: any) => {
      if (product.productKey === productKey) {
        let sumQuantity = 0;

        let batches = cloneDeep(product.batches);
        batches = orderBy(batches, ["isSelected"], ["desc"]);

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
    });

    setReturnProducts(orderObjectClone);
  };

  const { scannedData, isScanned } = useBarcodeScanner();

  // barcode scanner
  useEffect(() => {
    const getData = async () => {
      if (scannedData) {
        const productsScan = await getSaleProducts({
          ...formFilter,
          keyword: scannedData,
          branchId,
        });
        let product;
        if ((productsScan?.data?.items?.length ?? 0) > 0 && isSuccess) {
          product = productsScan?.data?.items?.find(
            (item) => item.barCode === scannedData
          );
        }

        if (product) {
          handleSelectProduct(JSON.stringify(product));
          return;
        }
      }
    };
    getData();
  }, [scannedData]);

  const columns: ColumnsType<IImportProductLocal> = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div className="w-5 flex-shrink-0">
          <Image
            src={RemoveIcon}
            className=" cursor-pointer"
            onClick={() => {
              const productImportClone = cloneDeep(returnProducts);
              const index = productImportClone.findIndex(
                (product) => product.id === id
              );
              productImportClone.splice(index, 1);
              setReturnProducts(productImportClone);
            }}
            alt=""
          />
        </div>
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
      render: (value) => (
        <span
          className="cursor-pointer text-[#0070F4]"
        // onClick={() => {
        //   const currentState = expandedRowKeys[`${index}`];
        //   const temp = { ...expandedRowKeys };
        //   if (currentState) {
        //     delete temp[`${index}`];
        //   } else {
        //     temp[`${index}`] = true;
        //   }
        //   setExpandedRowKeys({ ...temp });
        // }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
      render: (_, { product }) => product.name,
    },
    {
      title: "ĐVT",
      dataIndex: "units",
      key: "units",
      render: (_, record: any) => {
        if (id) {
          return record.productUnit?.unitName;
        }
        return (
          <CustomUnitSelect
            options={(() => {
              const productUnitKeysSelected = returnProducts.map((product) =>
                Number(product.productKey.split("-")[1])
              );

              return record?.product.productUnit?.map((unit) => ({
                value: unit.id,
                label: unit.unitName,
                disabled: productUnitKeysSelected.includes(unit.id),
              }));
            })()}
            value={record?.id}
            onChange={(value) => {
              let returnProductsClone = cloneDeep(returnProducts);

              returnProductsClone = returnProductsClone.map((product) => {
                if (product.productKey === record?.productKey) {
                  const productUnit: any = product.product.productUnit.find(
                    (unit) => unit.id === value
                  );
                  return {
                    ...product,
                    productKey: `${product.product.id}-${value}`,
                    ...productUnit,
                    primePrice:
                      product.product.primePrice * productUnit.exchangeValue,
                    price:
                      product.product.primePrice * productUnit.exchangeValue,
                    code: productUnit.code,
                    batches: product.batches?.map((batch) => ({
                      ...batch,
                      inventory:
                        batch.originalInventory / productUnit!.exchangeValue,
                    })),
                  };
                }

                return product;
              });

              setReturnProducts(returnProductsClone);
            }}
          />
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record: any) => (
        <div className="flex items-center gap-2">
          <CustomInput
            wrapClassName="!w-[110px]"
            className="!h-6 !w-[80px] text-center"
            hasMinus={true}
            hasPlus={true}
            defaultValue={quantity}
            value={quantity}
            // disabled={(id && record?.product?.isBatchExpireControl) ? true : false}
            type="number"
            onChange={(value) =>
              onChangeValueProduct(record?.productKey, "quantity", value)
            }
            onMinus={async (value) => {
              // if (id && record?.product?.isBatchExpireControl) return;
              // onChangeValueProduct(record?.productKey, 'quantity', value)
              await onExpandMoreBatches(record?.productKey, value);
            }}
            onPlus={async (value) => {
              // if (id && record?.product?.isBatchExpireControl) return;
              // onChangeValueProduct(record?.productKey, 'quantity', value)
              await onExpandMoreBatches(record?.productKey, value);
            }}
          />
          {/* {
            id && <div>
              / {record?.productBatchHistories[0]?.quantity}
            </div>
          } */}
        </div>
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "primePrice",
      key: "primePrice",
      render: (primePrice, record: any) => (
        <CustomInput
          type="number"
          bordered={false}
          onChange={(value) => { }}
          wrapClassName="w-[100px]"
          defaultValue={primePrice}
          disabled
        />
      ),
    },
    {
      title: "Giá trả lại",
      dataIndex: "price",
      key: "price",
      render: (price, record: any) => (
        <CustomInput
          type="number"
          bordered={false}
          onChange={(value) =>
            onChangeValueProduct(record?.productKey, "price", value)
          }
          wrapClassName="w-[100px]"
          defaultValue={id ? price : record?.primePrice}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, { quantity, discountValue, price, primePrice }) => {
        return formatMoney(quantity * price);
      },
    },
  ];

  console.log("returnProducts", returnProducts);

  const handleRemoveBatch = (productKey: string, batchId: number) => {
    let products = cloneDeep(returnProducts);

    products = products.map((product) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          batches: product.batches?.map((batch) => {
            if (batch.id === batchId) {
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
    // caculate total quantity
    products = products.map((product) => {
      return {
        ...product,
        quantity: product.batches?.reduce(
          (acc, obj: any) => acc + (obj.isSelected ? obj.quantity : 0),
          0
        ),
      };
    });
    setReturnProducts(products);
  };

  const checkDisplayListBatch = (product: IImportProductLocal) => {
    // return (
    //   product.product.type === EProductType.MEDICINE ||
    //   (product.product.type === EProductType.PACKAGE &&
    //     product.product.isBatchExpireControl)
    // );
    return product.product.isBatchExpireControl;
  };

  const handleSelectProduct = (value) => {
    const product: IImportProduct = JSON.parse(value);
    let isSelectedUnit = true;
    const localProduct: IImportProductLocal = {
      ...product,
      productKey: `${product.product.id}-${product.id}`,
      price: id
        ? product.productBatchHistories[0].importPrice
        : product.product.primePrice * product.productUnit.exchangeValue,
      inventory: product.quantity,
      quantity: 1,
      discountValue: 0,
      primePrice:
        product.product.primePrice * product.productUnit.exchangeValue,
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
      productBatchHistories: product?.productBatchHistories,
    };

    let cloneImportProducts = cloneDeep(returnProducts);

    if (returnProducts.find((p) => p.productKey === localProduct.productKey)) {
      cloneImportProducts = cloneImportProducts.map((product) => {
        if (product.productKey === localProduct.productKey) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }

        return product;
      });
    } else {
      cloneImportProducts.push(localProduct);
    }
    setReturnProducts(cloneImportProducts);
  };

  return (
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
          <div className="flex h-[72px] w-full  min-w-[800px] items-center bg-red-main px-6 py-3">
            <CustomAutocomplete
              className="!h-[48px] w-full !rounded text-base"
              prefixIcon={<Image src={SearchIcon} alt="" />}
              placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm"
              wrapClassName="w-full !rounded bg-white"
              listHeight={512}
              disabled={id ? true : false}
              onSelect={(value) => handleSelectProduct(value)}
              showSearch={true}
              onSearch={debounce((value) => {
                setFormFilter((preValue) => ({
                  ...preValue,
                  keyword: value,
                }));
              })}
              value={formFilter.keyword}
              options={products?.data?.items?.map((item) => ({
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
                      <div className="flex gap-x-3">
                        <div className="flex gap-x-1">
                          <div>{item.code}</div> {" - "}
                          <div>{item.product.name}</div>
                        </div>
                        <div className="rounded bg-red-main px-2 py-[2px] text-white">
                          {item.unitName}
                        </div>
                        {item.quantity <= 0 && (
                          <div className="rounded text-red-main  py-[2px] italic">
                            Hết hàng
                          </div>
                        )}
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
              dataSource={returnProducts?.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={columns}
              pagination={false}
              expandable={{
                defaultExpandAllRows: true,
                expandedRowRender: (record: IImportProductLocal) => {
                  if (importProductDetail && record?.batches?.length > 0) {
                    return (
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
                            (batch: any) =>
                              batch?.isSelected && (
                                <div
                                  key={batch.id}
                                  className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                                >
                                  <span className="mr-2">
                                    {batch?.name || batch?.batch?.name} -{" "}
                                    {batch.batch.expiryDate} - SL:{" "}
                                    {batch.quantity}
                                  </span>{" "}
                                  <Image
                                    className=" cursor-pointer"
                                    src={CloseIcon}
                                    onClick={() => {
                                      handleRemoveBatch(
                                        record.productKey,
                                        batch.id
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
                            errors?.products &&
                            errors?.products[Number(record.key) - 1]?.batches
                              ?.message
                          }
                        />
                      </div>
                    );
                  }
                  return (
                    <>
                      {checkDisplayListBatch(record) && (
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
                              (batch: any) =>
                                batch.isSelected && (
                                  <div
                                    key={batch.id}
                                    className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                                  >
                                    <span className="mr-2">
                                      {batch?.name || batch?.batch?.name} -{" "}
                                      {batch.expiryDate} - SL: {batch.quantity}
                                    </span>{" "}
                                    <Image
                                      className=" cursor-pointer"
                                      src={CloseIcon}
                                      onClick={() => {
                                        handleRemoveBatch(
                                          record.productKey,
                                          batch.id
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
                              errors?.products &&
                              errors?.products[Number(record.key) - 1]?.batches
                                ?.message
                            }
                          />
                        </div>
                      )}
                    </>
                  );
                },
                expandIcon: () => <></>,
                expandedRowKeys: Object.keys(expandedRowKeys).map(
                  (key) => +key + 1
                ),
              }}
            />

            <ListBatchModal
              key={openListBatchModal ? 1 : 0}
              isOpen={!!openListBatchModal}
              onCancel={() => setOpenListBatchModal(false)}
              productKeyAddBatch={productKeyAddBatch}
              onSave={(listBatch: IBatch[]) => {
                let returnProductsClone = cloneDeep(returnProducts);

                returnProductsClone = returnProductsClone.map((product) => {
                  if (product.productKey === productKeyAddBatch) {
                    return {
                      ...product,
                      quantity: listBatch.reduce(
                        (acc, obj) => acc + obj.quantity,
                        0
                      ),
                      batches: listBatch,
                    };
                  }

                  return product;
                });

                setReturnProducts(returnProductsClone);
                setError("products", { message: undefined });
              }}
            />
          </div>
        </div>
      </div>

      <RightContent
        useForm={{
          getValues,
          setValue,
          handleSubmit,
          reset,
          errors,
        }}
        importId={id as string}
      />
    </div>
  );
}
