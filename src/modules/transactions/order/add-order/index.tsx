import Image from "next/image";
import { useEffect, useState } from "react";

import RemoveIcon from "@/assets/removeIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";

import { getConfigProductPrivate, getMarketOrderDetail } from "@/api/market.service";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { formatMoney, formatNumber, getImage, sliceString } from "@/helpers";
import { branchState, marketOrderState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep, debounce } from "lodash";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import RightContent from "./RightContent";
import { schema } from "./schema";
import { useRouter } from "next/router";

export default function AddOrder() {
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
    defaultValues: {},
  });
  const router = useRouter();
  const { id } = router.query;
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
  const branchId = useRecoilValue(branchState);
  const [importProducts, setImportProducts] = useRecoilState(marketOrderState);

  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 16,
    keyword: "",
    status: "active",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    type: "common",
  });
  useEffect(() => {
    if (importProducts.length) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      importProducts.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [importProducts.length]);

  const { data: details, isLoading } = useQuery<{ data: any }>(
    ["MARKET_ORDER_DETAIL", id, branchId],
    () => getMarketOrderDetail(String(id)),
    {
      enabled: !!id && !!branchId,
    },
  );

  useEffect(() => {
    if (details?.data?.item) {
      const listProduct = details?.data?.item?.products?.map((product) => {
        return {
          ...product.marketProduct,
          productKey: `${product.marketProduct.product.id}-${product.marketProduct.id}`,
          inventory: product.quantity,
          realQuantity: product.quantity,
          price: product.price,
          discountValue: 0,
          marketProductId: product?.marketProductId,
          marketOrderProductId: product?.id,
        };
      });
      console.log("listProduct", listProduct);
      setImportProducts(listProduct);
      setValue("listProduct", listProduct);
      setValue("customerId", details?.data?.item?.customerId);
      setValue("note", details?.data?.item?.note);
    }
  }, [details?.data?.item]);

  console.log("importProducts", importProducts);

  const { data: products, isLoading: isLoadingConfigProductPrivate } = useQuery(
    ["CONFIG_PRODUCT_PRIVATE", JSON.stringify(formFilter), getValues("customerId")],
    () =>
      getConfigProductPrivate({
        page: formFilter?.page,
        keyword: formFilter?.keyword,
        limit: formFilter?.limit,
        sortBy: formFilter?.sortBy,
        productType: formFilter?.productType,
        customerId: getValues("customerId") ?? -1,
      }),
  );

  const onChangeValueProduct = (productKey, field, newValue) => {
    let productImportClone = cloneDeep(importProducts);

    productImportClone = productImportClone.map((product) => {
      if (product.productKey === productKey) {
        if (field === "realQuantity" && product.batches?.length === 1) {
          return {
            ...product,
            realQuantity: newValue,
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
          className=" cursor-pointer w-5 h-5 flex-shrink-0"
          onClick={() => {
            const productImportClone = cloneDeep(importProducts);
            const index = productImportClone.findIndex((product) => product.id === id);
            productImportClone.splice(index, 1);
            setImportProducts(productImportClone);
          }}
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
      render: (value, record, index) => <span className=" text-[#0070F4]">{record?.productUnit?.code}</span>,
    },
    {
      title: "Tên hàng",
      dataIndex: "product",
      key: "product",
      render: (product) => <div className="line-clamp-1">{sliceString(product.name, 70)}</div>,
    },
    {
      title: "ĐVT",
      dataIndex: "units",
      key: "units",
      render: (_, record) => <span>{record?.productUnit?.unitName}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "realQuantity",
      key: "realQuantity",
      render: (realQuantity, { productKey, product }) => (
        <CustomInput
          wrapClassName="!w-[110px]"
          className="!h-6 !w-[80px] text-center"
          hasMinus={true}
          hasPlus={true}
          defaultValue={realQuantity}
          value={realQuantity}
          type="text"
          // disabled={product?.isBatchExpireControl ? true : false}
          onChange={(value) => {
            // validate if value is not a number
            if (isNaN(value)) {
              message.error("Vui lòng nhập số");
              return;
            }
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
          onMinus={(value) => {
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
          onPlus={(value) => {
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (value, record) => (
        <CustomInput
          className="w-[100px]"
          onChange={(value) => {
            onChangeValueProduct(record.productKey, "price", value);
          }}
          value={value}
          disabled={!!details?.data?.item}
          type="number"
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "diffAmount",
      key: "diffAmount",
      render: (_, record) => formatNumber(Math.floor(record?.realQuantity * record?.price)),
    },
  ];

  const handleSelectProduct = (value) => {
    const product = JSON.parse(value);
    let isSelectedUnit = true;
    const localProduct: any = {
      ...product,
      productKey: `${product.product.id}-${product.id}`,
      price: product?.discountPrice > 0 ? product?.discountPrice : product.price,
      inventory: product.quantity,
      realQuantity: 1,
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
            // batches: product.batches.map((batch) => {
            //   const newBatch = {
            //     ...batch,
            //     // inventory,
            //     // originalInventory: batch.quantity,
            //     quantity: batch.isSelected ? batch.quantity + 1 : batch.quantity,
            //   };

            //   return newBatch;
            // }),
          };
        }

        return product;
      });
      setImportProducts(cloneImportProducts);
    } else {
      setImportProducts((prev) => [...prev, localProduct]);
    }
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
              onSelect={(value) => handleSelectProduct(value)}
              showSearch={true}
              listHeight={512}
              onSearch={(value) => {
                setFormFilter((prev) => ({
                  ...prev,
                  keyword: value,
                }));
              }}
              value={formFilter.keyword}
              options={products?.data?.items.map((item) => ({
                value: JSON.stringify(item),
                label: (
                  <div className="flex items-center gap-x-4 p-2">
                    <div className=" flex h-12 w-[68px] flex-shrink-0 items-center rounded border border-gray-300 p-[2px]">
                      {item.imageCenter && (
                        <Image src={getImage(item.imageCenter?.path)} height={40} width={68} alt="" objectFit="cover" />
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex gap-x-3">
                        <div>
                          <span>{item.code}</span> {" - "}
                          <span>{item.product.name}</span>
                        </div>
                        <div className="rounded bg-red-main px-2 py-[2px] text-white">{item.productUnit.unitName}</div>
                        {item.quantity - item.quantitySold <= 0 && (
                          <div className="rounded text-red-main py-[2px] italic">Hết hàng</div>
                        )}
                      </div>

                      <div className="flex gap-x-3">
                        <div>Số lượng: {formatNumber(item.quantity - item.quantitySold)}</div>
                        <div>|</div>
                        <div>Giá: {formatMoney(item?.discountPrice > 0 ? item?.discountPrice : item.price)}</div>
                      </div>
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
            />
          </div>
        </div>
      </div>

      <RightContent
        setValue={setValue}
        getValues={getValues}
        errors={errors}
        handleSubmit={handleSubmit}
        reset={reset}
        orderDetail={details?.data?.item}
      />
    </div>
  );
}
