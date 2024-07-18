import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { Popover } from "antd";
import cx from "classnames";
import { cloneDeep, debounce, orderBy } from "lodash";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

import { getSaleProducts, getSampleMedicines } from "@/api/product.service";
import BarcodeIcon from "@/assets/barcode.svg";
import CloseIcon from "@/assets/closeIcon.svg";
import FilterIcon from "@/assets/filterIcon.svg";
import PlusIcon from "@/assets/plusIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { EPaymentMethod } from "@/enums";
import {
  formatMoney,
  formatNumber,
  getImage,
  randomString,
  roundNumber,
} from "@/helpers";
import {
  branchState,
  orderActiveState,
  orderDiscountSelected,
  orderState,
  productDiscountSelected,
} from "@/recoil/state";

import { getOrderDetail } from "@/api/order.service";
import { CustomInput } from "@/components/CustomInput";
import useBarcodeScanner from "@/hooks/useBarcodeScanner";
import { useRouter } from "next/router";
import { SaleHeader } from "./Header";
import { LeftMenu } from "./LeftMenu";
import { ProductList } from "./ProductList";
import { RightContent } from "./RightContent";
import type {
  ISaleProduct,
  ISaleProductLocal,
  ISampleMedicine,
} from "./interface";
import { schema, schemaReturn } from "./schema";
import { RightContentReturn } from "./RightContentReturn";
import { CustomButton } from "@/components/CustomButton";
import {
  getOrderDiscountList,
  getProductDiscountList,
} from "@/api/discount.service";

const Index = () => {
  const branchId = useRecoilValue(branchState);
  const router = useRouter();
  const { id } = router.query;

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    isSale: true,
    keyword: "",
  });
  const [isSearchSampleMedicine, setIsSearchSampleMedicine] = useState(false);
  const [isScanBarcode, setIsScanBarcode] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [valueScanBarcode, setValueScanBarcode] = useState("");

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      paymentType: EPaymentMethod.CASH,
      paymentPoint: 0,
    },
  });
  const {
    getValues: getValuesReturn,
    setValue: setValueReturn,
    handleSubmit: handleSubmitReturn,
    formState: { errors: errorsReturn },
    setError: setErrorReturn,
    reset: resetReturn,
  } = useForm({
    resolver: yupResolver(schemaReturn),
    mode: "onChange",
    defaultValues: {
      paymentType: EPaymentMethod.CASH,
    },
  });

  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);
  const [orderObject, setOrderObject] = useRecoilState(orderState);
  const [orderDiscount, setOrderDiscount] = useRecoilState(
    orderDiscountSelected
  );
  const [productDiscount, setProductDiscount] = useRecoilState(
    productDiscountSelected
  );

  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    [
      "LIST_SALE_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getSaleProducts({ ...formFilter, branchId }),
    { enabled: !isSearchSampleMedicine }
  );

  const { data: sampleMedicines, isLoading: isLoadingSampleMedicines } =
    useQuery<{
      data?: { items: ISampleMedicine[] };
    }>(
      [
        "LIST_SAMPLE_MEDICINE",
        formFilter.page,
        formFilter.limit,
        formFilter.keyword,
        branchId,
      ],
      () => getSampleMedicines({ ...formFilter, branchId, status: 1 }),
      { enabled: !!isSearchSampleMedicine }
    );
  // caculate total price
  const totalPrice = useMemo(() => {
    let price = 0;
    orderObject[orderActive]?.forEach((product: ISaleProductLocal) => {
      const unit = product.product.productUnit?.find(
        (unit) => unit.id === product.productUnitId
      );

      price += Number(unit?.price ?? 0) * product.quantity;
    });

    return price;
  }, [orderObject, orderActive]);
  const getDiscountPostData = () => {
    const products = orderObject[orderActive]?.map(
      (product: ISaleProductLocal) => ({
        productUnitId: product.productUnitId,
        quantity: product.quantity,
      })
    );
    return {
      products,
      totalPrice: totalPrice,
      ...(getValues("customerId") && {
        customerId: getValues("customerId"),
      }),
      branchId: branchId,
    };
  };
  const data: any = getDiscountPostData();
  const { data: discountList, isLoading } = useQuery(
    ["ORDER_DISCOUNT_LIST", orderObject[orderActive]],
    () => getOrderDiscountList(data),
    {
      enabled: totalPrice > 0,
    }
  );

  const [searchKeyword, setSearchKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getDataDetail = async () => {
      if (id) {
        const orderDetail: any = await getOrderDetail(Number(id));
        if (orderDetail?.data?.products) {
          setOrderDetail(orderDetail?.data);
          setValue("customerId", orderDetail?.order?.customerId, {
            shouldValidate: true,
          });
          // add order detail to order object when order detail is loaded
          const orderObjectClone = cloneDeep(orderObject);

          orderObjectClone[orderActive + "-RETURN"] =
            orderDetail?.data?.products.map((product) => {
              const productKey = `${product?.productId}-${product.productUnit?.id}`;

              return {
                ...product,
                productKey,
                productUnit: {
                  ...product.productUnit,
                  code: product.product?.code,
                  returnPrice: product.productUnit.price,
                },
                quantity: product.quantity,
                productUnitId: product.productUnit.id,
                originProductUnitId: product.productUnit.id,
                batches: product.batches?.map((batch) => {
                  const inventory =
                    batch.batch.quantity / product.productUnit.exchangeValue;

                  const newBatch = {
                    ...batch,
                    inventory,
                    productKey,
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
            });
          setOrderActive(orderActive + "-RETURN");
          setOrderObject({ ...orderObject, ...orderObjectClone });
        }
      }
    };
    getDataDetail();
  }, [id]);

  const { scannedData, isScanned } = useBarcodeScanner();

  // barcode scanner
  useEffect(() => {
    async function handleScannedData() {
      if (scannedData) {
        const productsScan = await getSaleProducts({
          ...formFilter,
          keyword: scannedData,
          branchId,
        });
        let product;
        if (productsScan?.data?.items?.length > 0 && !isSearchSampleMedicine) {
          product = productsScan?.data?.items?.find(
            (item) => item.barCode === scannedData
          );
        }

        if (product) {
          onSelectedProduct(JSON.stringify(product));
          return;
        }
      }
    }
    handleScannedData();
  }, [scannedData, products?.data?.items, isSuccess, isSearchSampleMedicine]);

  useEffect(() => {
    setOrderDiscount([]);
  }, [orderActive]);

  // get product discount
  useEffect(() => {
    function handleGetProductDiscount() {
      if (
        discountList &&
        orderDiscount?.length > 0 &&
        orderObject[orderActive]?.length > 0
      ) {
        let orderDiscountClone: any = cloneDeep(orderDiscount);
        orderDiscountClone = orderDiscountClone?.forEach((item) => {
          const list = item?.items[0]?.apply?.productUnitId;
          if (list?.length > 0) {
            for (const l of list) {
              const productsScan = getSaleProducts({
                ...formFilter,
                keyword: "",
                branchId,
                productUnit: l,
              }).then((res) => {
                if (res?.data?.items?.length > 0) {
                  let discountValue = item?.items[0]?.apply?.discountValue;
                  let discountType = item?.items[0]?.apply?.discountType;
                  if (item?.items[0]?.apply?.isGift) {
                    discountType = "amount";
                    discountValue = res?.data?.items[0]?.price;
                  } else {
                    if (discountType === "percent" && discountValue > 100) {
                      discountValue = 100;
                    } else if (
                      discountType === "amount" &&
                      +discountValue > +res?.data?.items[0]?.price
                    ) {
                      discountValue = res?.data?.items[0]?.price;
                    }
                  }

                  if (res) {
                    onSelectedProduct(
                      JSON.stringify({
                        ...res?.data?.items[0],
                        maxQuantity: item.items[0].apply.maxQuantity,
                        isDiscount: true,
                        discountType: discountType,
                        discountValue: discountValue,
                        isGift: item?.items[0]?.apply?.isGift,
                      })
                    );
                  }
                }
              });
            }
          } else {
            // remove product added by discount before
            const orderObjectClone = cloneDeep(orderObject);
            orderObjectClone[orderActive] = orderObjectClone[
              orderActive
            ]?.filter((product) => !product.isDiscount);
            setOrderObject(orderObjectClone);
          }
        });
      }
    }
    handleGetProductDiscount();
  }, [orderDiscount]);

  // product discount
  useEffect(() => {
    function handleGetProductDiscount() {
      // if (productDiscount) {
      let productDiscountClone: any = cloneDeep(productDiscount);
      if (productDiscountClone?.length > 0) {
        productDiscountClone = productDiscountClone?.forEach((item) => {
          const list = item?.items[0]?.apply?.productUnitId;
          let fixedPrice = item?.items[0]?.apply?.fixedPrice;
          let changeType = item?.items[0]?.apply?.changeType;
          if (list?.length > 0) {
            for (const l of list) {
              getSaleProducts({
                ...formFilter,
                keyword: "",
                branchId,
                productUnit: l?.id ?? l,
              }).then((res) => {
                if (res?.data?.items?.length > 0) {
                  let discountValue = item?.items[0]?.apply?.discountValue;
                  let discountType = item?.items[0]?.apply?.discountType;

                  if (item?.items[0]?.apply?.isGift) {
                    discountType = "amount";
                    discountValue = res?.data?.items[0]?.price;
                  } else {
                    if (discountType === "percent" && discountValue > 100) {
                      discountValue = 100;
                    } else if (
                      discountType === "amount" &&
                      +discountValue > +res?.data?.items[0]?.price
                    ) {
                      discountValue = res?.data?.items[0]?.price;
                    }
                  }

                  return onSelectedProduct(
                    JSON.stringify({
                      ...res?.data?.items[0],
                      discountQuantity: l.discountQuantity || 1,
                      isDiscount: true,
                      discountType: discountType,
                      discountValue: discountValue,
                      isGift: item?.items[0]?.apply?.isGift,
                    })
                  );
                }
              });
            }
          } else {
            if (fixedPrice > 0 && changeType === "type_price") {
              // update price of product same productUnitId
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[
                orderActive
              ]?.map((product: ISaleProductLocal) => {
                if (
                  product.productUnitId ===
                  item?.items[0]?.condition?.productUnitId[0]
                ) {
                  return {
                    ...product,
                    isDiscount: true,
                    itemPrice: fixedPrice,
                    productUnit: {
                      ...product.productUnit,
                      oldPrice: product.productUnit.price,
                      price: fixedPrice,
                    },
                    buyNumberType: 1,
                  };
                }
                return product;
              });
              setOrderObject(orderObjectClone);
            } else if (fixedPrice > 0 && changeType === "type_discount") {
              // update price of product same productUnitId
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[
                orderActive
              ]?.map((product: ISaleProductLocal) => {
                if (
                  product.productUnitId ===
                  item?.items[0]?.condition?.productUnitId[0]
                ) {
                  return {
                    ...product,
                    discountValue: fixedPrice,
                    isDiscount: true,
                    discountType: "amount",
                    itemPrice: product.productUnit.oldPrice
                      ? product.productUnit.oldPrice - fixedPrice
                      : product.productUnit.price - fixedPrice,
                    ...(product.productUnit?.oldPrice && {
                      productUnit: {
                        ...product.productUnit,
                        price: product.productUnit.oldPrice,
                      },
                    }),
                    buyNumberType: 2,
                  };
                }
                return product;
              });
              setOrderObject(orderObjectClone);
            } else {
              // remove product added by discount before
              const orderObjectClone = cloneDeep(orderObject);
              orderObjectClone[orderActive] = orderObjectClone[
                orderActive
              ]?.filter((product) => !product.isDiscount);
              return setOrderObject(orderObjectClone);
            }
          }
        });
      } else {
        // remove product added by discount before
        const orderObjectClone = cloneDeep(orderObject);
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter(
          (product) => !product.isDiscount
        );
        return setOrderObject(orderObjectClone);
      }
      // }
    }
    handleGetProductDiscount();
  }, [productDiscount]);
  useEffect(() => {
    // update product when order discount is changed
    if (orderDiscount?.length <= 0) {
      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter(
        (product) => !product.isDiscount
      );
      setOrderObject(orderObjectClone);
    }
  }, [orderDiscount]);

  const onExpandMoreBatches = async (
    productKey,
    quantity: number,
    product?: any
  ) => {
    const orderObjectClone = cloneDeep(orderObject);

    const res = await getProductDiscountList({
      productUnitId: product?.id,
      branchId: branchId,
      quantity: quantity,
    });
    let itemDiscountProduct = res?.data?.data?.items;

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
      }
    );

    setOrderObject(orderObjectClone);
  };

  // select product
  const onSelectedProduct = (value) => {
    const product: ISaleProduct = JSON.parse(value);
    const productKey = `${product.product.id}-${product.productUnit.id}`;

    const orderObjectClone = cloneDeep(orderObject);

    if (
      orderObjectClone[orderActive]?.find(
        (item) => item.productKey === productKey && !product?.isDiscount
      )
    ) {
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
        (p: ISaleProductLocal) => {
          if (p.productKey === productKey && !product.isDiscount) {
            return {
              ...p,
              quantity: p.quantity + 1,
              // update batches
              batches: p.batches.map((batch) => {
                const inventory =
                  batch.quantity / product.productUnit.exchangeValue;
                const newBatch = {
                  ...batch,
                  // inventory,
                  // originalInventory: batch.quantity,
                  quantity: batch.isSelected
                    ? batch.quantity + 1
                    : batch.quantity,
                };

                return newBatch;
              }),
            };
          }

          return p;
        }
      );
      setOrderObject((pre) => ({ ...pre, ...orderObjectClone }));
    } else {
      let isSelectedUnit = true;

      let itemDiscountProduct;

      const res = getProductDiscountList({
        productUnitId: product?.id,
        branchId: branchId,
        quantity: 1,
        customerId: getValues("customerId"),
      }).then((res) => {
        if (res?.data) {
          itemDiscountProduct = res?.data?.data?.items;

          const productLocal: any = {
            ...product,
            inventory: product.quantity,
            productKey,
            quantity: product?.isDiscount ? product?.discountQuantity : 1,
            productUnitId: product.id,
            itemDiscountProduct: itemDiscountProduct,
            originProductUnitId: product.id,
            batches: product.batches?.map((batch) => {
              const inventory =
                batch.quantity / product.productUnit.exchangeValue;

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
          // orderObjectClone[orderActive]?.push(productLocal);
          setOrderObject((pre) => ({
            ...pre,
            [orderActive]: [...pre[orderActive], productLocal],
          }));
        }
      });
    }
    // setOrderObject((pre) => ({ ...pre, ...orderObjectClone }));
    inputRef.current?.select();
    // setOrderObject(orderObjectClone);
    setFormFilter((pre) => ({ ...pre, keyword: "" }));
  };

  const onSelectedSampleMedicine = (value) => {
    const sampleMedicines: ISampleMedicine = JSON.parse(value);

    const orderObjectClone = cloneDeep(orderObject);

    sampleMedicines.products.forEach((product) => {
      const productKey = `${product.product.id}-${product.productUnit.id}`;

      if (
        orderObjectClone[orderActive]?.find(
          (item) => item.productKey === productKey
        )
      ) {
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map(
          (product: ISaleProductLocal) => {
            if (product.productKey === productKey) {
              return {
                ...product,
                quantity: product.quantity + 1,
              };
            }

            return product;
          }
        );
      } else {
        let isSelectedUnit = true;

        const productLocal: any = {
          ...product,
          ...product.productUnit,
          productKey,
          quantity: 1,
          productUnitId: product.productUnitId,
          originProductUnitId: product.productUnitId,
          batches: product.batches?.map((batch) => {
            const inventory =
              batch.quantity / product.productUnit.exchangeValue;
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

        orderObjectClone[orderActive]?.push(productLocal);
      }
    });

    setOrderObject(orderObjectClone);
  };

  // Search product
  const onSearch = useCallback(
    debounce((value) => {
      setFormFilter((preValue) => ({
        ...preValue,
        keyword: value,
      }));
    }, 300),
    [formFilter]
  );

  return (
    <div>
      <SaleHeader />

      <div className="flex">
        <LeftMenu />

        <div className="grow overflow-x-auto">
          <div className="flex px-3 py-2">
            <span className="mr-1 text-[#D64457]">Dashboard / </span>
            <span>Bán hàng</span>
          </div>
          <div className="bg-red-main pr-6">
            <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
              <div className="flex h-[62px] min-w-[800px]  items-center  px-6">
                <div className="py-3">
                  {!isScanBarcode ? (
                    <CustomAutocomplete
                      onSelect={(value) => {
                        if (isSearchSampleMedicine) {
                          onSelectedSampleMedicine(value);
                          return;
                        }

                        onSelectedProduct(value);

                        setFormFilter((pre) => ({ ...pre, keyword: "" }));
                        setSearchKeyword("");
                      }}
                      onSearch={(value) => {
                        setSearchKeyword(value);
                        onSearch(value);
                      }}
                      showSearch={true}
                      className="h-[48px]  rounded-[30px] bg-white text-base"
                      wrapClassName="!w-[466px]"
                      prefixIcon={<Image src={SearchIcon} alt="" />}
                      suffixIcon={
                        <Popover
                          content={
                            isSearchSampleMedicine
                              ? "Tìm kiếm theo đơn thuốc mẫu"
                              : "Tìm kiếm theo thuốc, hàng hóa"
                          }
                        >
                          <div
                            className={`flex cursor-pointer items-center ${
                              isSearchSampleMedicine
                                ? "rounded border border-blue-500"
                                : ""
                            }`}
                          >
                            <Image
                              src={FilterIcon}
                              alt=""
                              onClick={(e) => {
                                setIsSearchSampleMedicine((pre) => !pre);
                                e.stopPropagation();
                              }}
                            />
                          </div>
                        </Popover>
                      }
                      placeholder="Thêm sản phẩm mới vào đơn F3"
                      options={
                        !isSearchSampleMedicine
                          ? products?.data?.items?.map((item) => ({
                              value: JSON.stringify(item),
                              label: (
                                <div className="flex items-center gap-x-4 p-2">
                                  <div className=" flex h-12 w-[68px] items-center rounded border border-gray-300 p-[2px]">
                                    {item.product?.image?.path && (
                                      <Image
                                        src={getImage(
                                          item.product?.image?.path
                                        )}
                                        height={40}
                                        width={68}
                                        alt=""
                                        objectFit="cover"
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <div className="mb-2 flex gap-x-3">
                                      <div>
                                        <span>{item.code}</span> {" - "}
                                        <span>{item.product.name}</span>
                                      </div>
                                      <div className="rounded bg-red-main px-2 py-[2px] text-white">
                                        {item.productUnit.unitName}
                                      </div>
                                      {item.quantity <= 0 && (
                                        <div className="rounded text-red-main py-[2px] italic">
                                          Hết hàng
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex gap-x-3">
                                      <div>
                                        Số lượng: {formatNumber(item.quantity)}
                                      </div>
                                      <div>|</div>
                                      <div>
                                        Giá:{" "}
                                        {formatMoney(item.productUnit.price)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ),
                            }))
                          : sampleMedicines?.data?.items?.map((item) => ({
                              value: JSON.stringify(item),
                              label: (
                                <div className="flex items-center gap-x-4 p-2">
                                  <div className=" flex h-12 w-[68px] items-center rounded border border-gray-300 p-[2px]">
                                    {item.image?.path && (
                                      <Image
                                        src={getImage(item.image?.path)}
                                        height={40}
                                        width={68}
                                        alt=""
                                        objectFit="cover"
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <div className="mb-2 flex gap-x-5">
                                      <div>{item.name}</div>
                                    </div>
                                  </div>
                                </div>
                              ),
                            }))
                      }
                      value={searchKeyword}
                      isLoading={isLoadingProduct || isLoadingSampleMedicines}
                      listHeight={512}
                      popupClassName="search-product"
                      disabled={orderActive.split("-")[1] === "RETURN"}
                    />
                  ) : (
                    <CustomInput
                      className="h-[48px] w-[466px] rounded-[30px] bg-white text-sm"
                      placeholder="Thêm sản phẩm mới vào đơn F3"
                      onChange={(value) => {
                        setValueScanBarcode(value);
                      }}
                      refInput={inputRef}
                      value={valueScanBarcode}
                      onFocus={(e) => e.target.select()}
                      autoFocus
                      prefixIcon={<Image src={SearchIcon} alt="" />}
                    />
                  )}
                </div>

                <CustomButton
                  outline
                  disabled={orderActive.split("-")[1] === "RETURN"}
                >
                  <Popover content={"Quét mã vạch"}>
                    <div
                      className={`flex cursor-pointer items-center ${
                        isScanBarcode ? "rounded border border-blue-500" : ""
                      }`}
                    >
                      <Image
                        src={BarcodeIcon}
                        className={`w-[24px] h-[24px] cursor-pointer text-[#D64457]`}
                        alt=""
                        onClick={(e) => {
                          setIsScanBarcode((pre) => !pre);
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  </Popover>
                </CustomButton>

                {Object.keys(orderObject).map((order: any, index) => (
                  <div key={order} className="flex">
                    <div className="mx-6 h-[62px] w-[1px] bg-[#E4E4E4]" />

                    <div className="flex py-3">
                      <button
                        onClick={() => {
                          setOrderActive(order);
                        }}
                        className={cx(
                          "w-max mr-2  flex items-center rounded-[40px] border border-[#fff]  py-2 px-4 text-[#D64457]",
                          order === orderActive ? "bg-[#F7DADD]" : "bg-[#fff]"
                        )}
                      >
                        <span className={cx("mr-1 text-base font-medium")}>
                          Đơn {order.split("-")[1] === "RETURN" ? "trả" : "bán"}{" "}
                          {index + 1}
                        </span>

                        <Image
                          className=" cursor-pointer"
                          src={CloseIcon}
                          alt=""
                          onClick={(e) => {
                            if (Object.keys(orderObject).length === 1) {
                              return;
                            }

                            const orderClone = cloneDeep(orderObject);
                            delete orderClone[order];
                            setOrderObject(orderClone);
                            setOrderActive(
                              Object.keys(orderClone)[0] as string
                            );

                            e.stopPropagation();
                          }}
                        />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const key = randomString();

                    const orderClone = cloneDeep(orderObject);
                    orderClone[key] = [];

                    setOrderObject(orderClone);
                    setOrderActive(key);
                  }}
                  className="ml-4 flex min-w-fit rounded-full border border-[#fff] bg-[#fff] p-[10px]"
                >
                  <Image src={PlusIcon} alt="" />
                </button>
              </div>
            </div>
          </div>

          <ProductList
            useForm={{ errors, setError }}
            orderDetail={orderDetail}
            listDiscount={discountList}
          />
        </div>

        {orderActive.split("-")[1] === "RETURN" ? (
          <RightContentReturn
            useForm={{
              getValuesReturn,
              setValueReturn,
              handleSubmitReturn,
              errorsReturn,
              resetReturn,
            }}
            customerId={orderObject[orderActive]?.[0]?.customerId}
            orderDetail={orderDetail}
          />
        ) : (
          <RightContent
            useForm={{ getValues, setValue, handleSubmit, errors, reset }}
            discountList={discountList}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
