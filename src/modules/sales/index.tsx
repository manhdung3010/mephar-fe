import { getOrderDiscountList, getProductDiscountList } from "@/api/discount.service";
import { getOrderDetail } from "@/api/order.service";
import { getSaleProducts, getSampleMedicines } from "@/api/product.service";
import BarcodeIcon from "@/assets/barcode.svg";
import CloseIcon from "@/assets/closeIcon.svg";
import FilterIcon from "@/assets/filterIcon.svg";
import PlusIcon from "@/assets/plusIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { EPaymentMethod } from "@/enums";
import { formatMoney, formatNumber, getImage, randomString } from "@/helpers";
import useBarcodeScanner from "@/hooks/useBarcodeScanner";
import { branchState, discountState, orderActiveState, orderState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { Popover } from "antd";
import cx from "classnames";
import { cloneDeep, debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { SaleHeader } from "./Header";
import { LeftMenu } from "./LeftMenu";
import { ProductList } from "./ProductList";
import { RightContent } from "./RightContent";
import { RightContentReturn } from "./RightContentReturn";
import type { ISaleProduct, ISaleProductLocal, ISampleMedicine } from "./interface";
import { schema, schemaReturn } from "./schema";

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
  const [discountObject, setDiscountObject] = useRecoilState(discountState);

  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    ["LIST_SALE_PRODUCT", formFilter.page, formFilter.limit, formFilter.keyword, branchId],
    () => getSaleProducts({ ...formFilter, branchId }),
    { enabled: !isSearchSampleMedicine },
  );
  const { data: products2, isLoading: isLoadingProduct2 } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_SALE_PRODUCT2", 1, 9999, "", branchId], () => getSaleProducts({ ...formFilter, branchId }), {
    enabled: !isSearchSampleMedicine,
  });
  const { data: sampleMedicines, isLoading: isLoadingSampleMedicines } = useQuery<{
    data?: { items: ISampleMedicine[] };
  }>(
    ["LIST_SAMPLE_MEDICINE", formFilter.page, formFilter.limit, formFilter.keyword, branchId],
    () => getSampleMedicines({ ...formFilter, branchId, status: 1 }),
    { enabled: !!isSearchSampleMedicine },
  );
  // caculate total price
  const totalPrice = useMemo(() => {
    let price = 0;
    orderObject[orderActive]?.forEach((product: ISaleProductLocal) => {
      const unit = product?.product?.productUnit?.find((unit) => unit.id === product.productUnitId);

      price += Number(unit?.price ?? 0) * product.quantity;
    });

    return price;
  }, [orderObject, orderActive]);
  const getDiscountPostData = () => {
    const products = orderObject[orderActive]?.map((product: ISaleProductLocal) => ({
      productUnitId: product.productUnitId,
      quantity: product.quantity,
    }));
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
    ["ORDER_DISCOUNT_LIST", orderObject[orderActive], getValues("customerId"), totalPrice],
    () => getOrderDiscountList(data, undefined, "OFFLINE"),
    {
      enabled: totalPrice > 0,
    },
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getDataDetail = async () => {
      if (id) {
        const orderDetail: any = await getOrderDetail(Number(id), {
          saleReturn: true,
        });
        if (orderDetail?.data?.products) {
          setOrderDetail(orderDetail?.data);
          setValue("customerId", orderDetail?.order?.customerId, {
            shouldValidate: true,
          });
          // add order detail to order object when order detail is loaded
          const orderObjectClone = cloneDeep(orderObject);
          orderObjectClone[orderActive + "-RETURN"] = orderDetail?.data?.products.map((product) => {
            const productKey = `${product?.productId}-${product.productUnit?.id}`;
            return {
              ...product,
              // isDiscount: product?.itemPrice !== product?.price,
              itemPrice: product?.itemPrice,
              price:
                product?.itemPrice > 0 ? product?.itemPrice / product?.quantity : product?.price / product?.quantity,
              productKey,
              productUnit: {
                ...product.productUnit,
                code: product.product?.code,
                price:
                  product?.itemPrice > 0 ? product?.itemPrice / product?.quantity : product?.price / product?.quantity,
                returnPrice:
                  product?.itemPrice > 0 ? product?.itemPrice / product?.quantity : product?.price / product?.quantity,
                marketPrice: product?.price / product?.quantity,
                marketOriginalPrice: product?.price / product?.quantity,
              },
              quantity: product?.quantityLast ? product?.quantity - product?.quantityLast : product?.quantity,
              originalQuantity: product?.quantity,
              productUnitId: product.productUnit.id,
              originProductUnitId: product.productUnit.id,
              batches: product.batches?.map((batch) => {
                const inventory = batch.batch.quantity / product.productUnit.exchangeValue;
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
                  saleQuantity: product?.quantityLast ? product?.quantity - product?.quantityLast : product?.quantity,
                  quantity: product?.quantityLast ? product?.quantity - product?.quantityLast : batch.quantity,
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
          product = productsScan?.data?.items?.find((item) => item.barCode === scannedData);
        }
        if (product) {
          onSelectedProduct(JSON.stringify(product));
          return;
        }
      }
    }
    handleScannedData();
  }, [scannedData, products?.data?.items, isSuccess, isSearchSampleMedicine]);

  // update orderObject when discountObject is changed
  useEffect(() => {
    if (discountObject[orderActive]?.orderDiscount?.length > 0) {
      // update orderObject
      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product) => {
        const productKey = `${product.product.id}-${product.productUnit.id}`;
        const productDiscount = discountObject[
          orderActive
        ]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected?.find((product) => product.id === productKey);
        if (productDiscount) {
          return {
            ...product,
            discountQuantity: productDiscount.discountQuantity,
          };
        }
        return product;
      });
    }
  }, [discountObject]);

  // giam gia hoa don
  useEffect(() => {
    // update product when discountObject is changed
    if (discountObject[orderActive]?.orderDiscount?.length > 0) {
      const orderObjectClone = cloneDeep(orderObject);
      const productDiscountSelected =
        discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.productUnitSelected;
      const haveProductDiscount = orderObjectClone[orderActive]?.some((product) => product.isDiscount);
      const orderDiscountType = discountObject[orderActive]?.orderDiscount[0]?.type;
      const discountType = discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.discountType;
      const discountValue = discountObject[orderActive]?.orderDiscount[0]?.items[0]?.apply?.discountValue;
      // reset product discount
      if (haveProductDiscount && !id) {
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
        setOrderObject(orderObjectClone);
      }
      // type = gift
      if (orderDiscountType === "gift" && productDiscountSelected?.length > 0) {
        productDiscountSelected.forEach((product) => {
          return onSelectedProduct(
            JSON.stringify({
              ...product,
              productUnit: {
                ...product?.productUnit,
                oldPrice: product?.productUnit?.price,
                price: product?.productUnit?.price,
              },
              discountValue: product?.productUnit?.price, // giá KM
              productUnitId: product.productUnitId,
              isDiscount: true,
              isGift: true,
              price: 0,
              discountQuantity: product.discountQuantity,
              inventory: product.quantity,
            }),
          );
        });
      }
      // type = product_price
      if (orderDiscountType === "product_price" && productDiscountSelected?.length > 0) {
        productDiscountSelected.forEach((product) => {
          return onSelectedProduct(
            JSON.stringify({
              ...product,
              productUnitId: product.productUnit[0]?.id,
              productUnit: {
                ...product?.productUnit,
                oldPrice: product?.productUnit?.price,
                price: product?.productUnit?.price,
              },
              discountValue:
                discountType === "amount"
                  ? discountValue
                  : product?.productUnit?.price - product?.productUnit?.price * (1 - discountValue / 100),
              isDiscount: true,
              isGift: false,
              price:
                discountType === "amount"
                  ? product.productUnit?.price - discountValue
                  : product.productUnit?.price * (1 - discountValue / 100),
              discountQuantity: product.discountQuantity,
            }),
          );
        });
      }
    } else {
      // reset product discount
      const orderObjectClone = cloneDeep(orderObject);
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
      setOrderObject(orderObjectClone);
    }
  }, [discountObject[orderActive]?.orderDiscount]);

  // khuyen mai hang hoa
  useEffect(() => {
    if (discountObject[orderActive]?.productDiscount?.length > 0) {
      const orderObjectClone = cloneDeep(orderObject);
      const haveProductDiscount = orderObjectClone[orderActive]?.some((product) => product.isDiscount);
      // reset product discount
      if (haveProductDiscount) {
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
        setOrderObject(orderObjectClone);
      }
      // type = gift
      // add all product discount to orderObject
      discountObject[orderActive]?.productDiscount?.forEach((discount) => {
        const productDiscountSelected = discount?.items[0]?.apply?.productUnitSelected;
        const discountType = discount?.items[0]?.apply?.discountType;

        if (productDiscountSelected?.length > 0 && discount?.type === "gift") {
          productDiscountSelected.forEach((product) => {
            return onSelectedProduct(
              JSON.stringify({
                ...product,
                productUnit: {
                  ...product?.productUnit,
                  oldPrice: product?.productUnit?.price,
                  price: product?.productUnit?.price,
                },
                discountValue: product?.productUnit?.price, // giá KM
                productUnitId: product.productUnitId,
                isDiscount: true,
                isGift: true,
                price: 0,
                discountQuantity: product.discountQuantity,
                inventory: product.quantity,
              }),
            );
          });
        } else if (productDiscountSelected?.length > 0 && discount?.type === "product_price") {
          productDiscountSelected.forEach((product) => {
            return onSelectedProduct(
              JSON.stringify({
                ...product,
                productUnitId: product.productUnit[0]?.id,
                productUnit: {
                  ...product?.productUnit,
                  oldPrice: product?.productUnit?.price,
                  price: product?.productUnit?.price,
                },
                discountValue:
                  discountType === "amount"
                    ? discount?.items[0]?.apply?.discountValue
                    : product?.productUnit?.price -
                      product?.productUnit?.price * (1 - discount?.items[0]?.apply?.discountValue / 100),
                isDiscount: true,
                isGift: false,
                price:
                  discountType === "amount"
                    ? product.productUnit?.price - discount?.items[0]?.apply?.discountValue
                    : product.productUnit?.price * (1 - discount?.items[0]?.apply?.discountValue / 100),
                discountQuantity: product.discountQuantity,
              }),
            );
          });
        } else if (discount?.type === "loyalty") {
          const orderObjectClone2 = cloneDeep(orderObject);
          // add pointDiscount to product
          const pointValue = discount?.items[0]?.apply?.pointValue;
          // set pointValue to this product in orderObject
          orderObjectClone2[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
            if (product.productUnitId === discount?.productUnitSelected) {
              return {
                ...product,
                discountValue: 0,
                price: product?.productUnit?.price,
                pointValue: pointValue,
              };
            }
            return product;
          });
          setOrderObject(orderObjectClone2);
        } else {
          const orderObjectClone = cloneDeep(orderObject);
          // add pointDiscount to product
          const changeType = discount?.items[0]?.apply?.changeType;
          const fixedPrice = discount?.items[0]?.apply?.fixedPrice;
          // set pointValue to this product in orderObject
          orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
            if (product.productUnitId === discount?.productUnitSelected) {
              return {
                ...product,
                pointValue: 0,
                discountValue: changeType === "type_discount" ? fixedPrice : product.productUnit?.price - fixedPrice,
                price: changeType === "type_discount" ? product?.productUnit?.price - fixedPrice : fixedPrice,
                isDiscountPrice: true,
              };
            }
            return product;
          });
          setOrderObject(orderObjectClone);
        }
      });
    } else {
      // reset product discount
      const orderObjectClone = cloneDeep(orderObject);
      if (!id) {
        // do sth
      } else {
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.filter((product) => !product.isDiscount);
      }
      setOrderObject(orderObjectClone);
    }
  }, [discountObject[orderActive]?.productDiscount]);

  // select product
  const onSelectedProduct = (value) => {
    const product: ISaleProduct = JSON.parse(value);
    const productKey = `${product.product.id}-${product.productUnit.id}`;

    const orderObjectClone = cloneDeep(orderObject);

    if (orderObjectClone[orderActive]?.find((item) => item.productKey === productKey && !product?.isDiscount)) {
      orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((p: ISaleProductLocal) => {
        if (p.productKey === productKey && !product.isDiscount) {
          return {
            ...p,
            quantity: p.quantity + 1,
            // update batches
            batches: p.batches.map((batch) => {
              const inventory = batch.quantity / product.productUnit.exchangeValue;
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
        return p;
      });
      setOrderObject((pre) => ({ ...pre, ...orderObjectClone }));
    } else {
      let isSelectedUnit = true;
      let itemDiscountProduct;
      const res = getProductDiscountList(
        {
          productUnitId: product?.id,
          branchId: branchId,
          quantity: 1,
          customerId: getValues("customerId"),
        },
        undefined,
        "OFFLINE",
      ).then((res) => {
        if (res?.data) {
          itemDiscountProduct = res?.data?.data?.items;
          const productLocal: any = {
            ...product,
            inventory: product.quantity,
            productKey,
            quantity: product?.isDiscount ? product?.discountQuantity : 1,
            productUnitId: product.productUnitId || product?.productUnit?.id,
            itemDiscountProduct: itemDiscountProduct,
            originProductUnitId: product.id,
            batches: product.batches?.map((batch) => {
              const inventory = batch.quantity / product.productUnit.exchangeValue;
              const newBatch: any = {
                ...batch,
                inventory,
                originalInventory: batch.quantity,
                quantity: 0,
                isSelected: inventory >= 1 ? isSelectedUnit : false,
              };
              if (inventory >= 1 && isSelectedUnit) {
                isSelectedUnit = false;
                newBatch.quantity = product?.isDiscount ? product?.discountQuantity : 1;
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
    inputRef.current?.select();
    setFormFilter((pre) => ({ ...pre, keyword: "" }));
  };

  const onSelectedSampleMedicine = (value) => {
    const sampleMedicines: ISampleMedicine = JSON.parse(value);
    const orderObjectClone = cloneDeep(orderObject);
    sampleMedicines.products.forEach((product) => {
      const productKey = `${product.product.id}-${product.productUnit.id}`;
      if (orderObjectClone[orderActive]?.find((item) => item.productKey === productKey)) {
        orderObjectClone[orderActive] = orderObjectClone[orderActive]?.map((product: ISaleProductLocal) => {
          if (product.productKey === productKey) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }
          return product;
        });
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
    [formFilter],
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
                            isSearchSampleMedicine ? "Tìm kiếm theo đơn thuốc mẫu" : "Tìm kiếm theo thuốc, hàng hóa"
                          }
                        >
                          <div
                            className={`flex cursor-pointer items-center ${
                              isSearchSampleMedicine ? "rounded border border-blue-500" : ""
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
                                  <div className=" flex h-12 w-[68px] flex-shrink-0 items-center rounded border border-gray-300 p-[2px]">
                                    {item.product?.image?.path && (
                                      <Image
                                        src={getImage(item.product?.image?.path)}
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
                                        <div className="rounded text-red-main py-[2px] italic">Hết hàng</div>
                                      )}
                                    </div>

                                    <div className="flex gap-x-3">
                                      <div>Số lượng: {formatNumber(item.quantity)}</div>
                                      <div>|</div>
                                      <div>Giá: {formatMoney(item.productUnit.price)}</div>
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
                          order === orderActive ? "bg-[#F7DADD]" : "bg-[#fff]",
                        )}
                      >
                        <span className={cx("mr-1 text-base font-medium")}>
                          Đơn {order.split("-")[1] === "RETURN" ? "trả" : "bán"} {index + 1}
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
                            setOrderActive(Object.keys(orderClone)[0] as string);

                            setDiscountObject((pre) => {
                              const preClone = { ...pre };
                              delete preClone[order];
                              return preClone;
                            });

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
                    setDiscountObject({
                      ...discountObject,
                      [key]: { productDiscount: [], orderDiscount: [] },
                    });
                  }}
                  className="ml-4 flex min-w-fit rounded-full border border-[#fff] bg-[#fff] p-[10px]"
                >
                  <Image src={PlusIcon} alt="" />
                </button>
              </div>
            </div>
          </div>

          <ProductList
            useForm={{ errors, setError, getValues }}
            useFormReturn={{ errorsReturn, setErrorReturn }}
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
              setErrorReturn,
            }}
            customerId={orderObject[orderActive]?.[0]?.customerId}
            orderDetail={orderDetail}
          />
        ) : (
          <RightContent useForm={{ getValues, setValue, handleSubmit, errors, reset }} discountList={discountList} />
        )}
      </div>
    </div>
  );
};

export default Index;
