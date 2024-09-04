import Image from "next/image";
import { useState } from "react";

import RemoveIcon from "@/assets/removeIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";

import { getInventoryDetail } from "@/api/check-inventory";
import { getSaleProducts } from "@/api/product.service";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { formatNumber, getImage } from "@/helpers";
import { branchState, checkInventoryState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep, debounce } from "lodash";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { RightContent } from "./rightContent";
import { schema } from "./schema";
import { getMarketOrderDetail } from "@/api/market.service";

export function EditOrder() {
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
  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const branchId = useRecoilValue(branchState);
  const [importProducts, setImportProducts] =
    useRecoilState(checkInventoryState);
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();

  const router = useRouter();
  const { id } = router.query;

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    isSale: true,
    keyword: "",
  });

  const { data: details } = useQuery<{ data: any }>(
    ["MARKET_ORDER_DETAIL", id, branchId],
    () => getMarketOrderDetail(String(id), branchId),
    {
      enabled: !!id && !!branchId,
    }
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
          className=" cursor-pointer"
          onClick={() => {
            const productImportClone = cloneDeep(importProducts);
            const index = productImportClone.findIndex(
              (product) => product.id === id
            );
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
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "product",
      key: "product",
      render: (product) => product.name,
    },
    {
      title: "ĐVT",
      dataIndex: "units",
      key: "units",
      render: (_, { productKey, product, id, exchangeValue }) => (
        <CustomUnitSelect
          options={(() => {
            const productUnitKeysSelected = importProducts.map((product) =>
              Number(product.productKey.split("-")[1])
            );

            return product.productUnit.map((unit) => ({
              value: unit.id,
              label: unit.unitName,
              disabled: productUnitKeysSelected.includes(unit.id),
            }));
          })()}
          value={id}
          onChange={(value) => {
            let importProductsClone = cloneDeep(importProducts);
            importProductsClone = importProductsClone.map((p) => {
              if (p.productKey === productKey) {
                const productUnit = p.product.productUnit.find(
                  (unit) => unit.id === value
                );

                return {
                  ...p,
                  code: productUnit?.code || "", // Assign an empty string if productUnit.code is undefined
                  price:
                    p.product.primePrice * Number(productUnit?.exchangeValue),
                  primePrice:
                    p.product.primePrice * Number(productUnit?.exchangeValue),
                  productKey: `${p.product.id}-${value}`,
                  ...productUnit,
                  batches: p.batches?.map((batch) => ({
                    ...batch,
                    inventory:
                      batch.originalInventory / productUnit!.exchangeValue,
                  })),
                  newInventory: Math.floor(
                    product.quantity / productUnit!.exchangeValue
                  ),
                };
              }
              return p;
            });
            console.log("importProductsClone", importProductsClone);
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
    {
      title: "Thực tế",
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
          disabled={product?.isBatchExpireControl ? true : false}
          onChange={(value) => {
            // validate if value is not a number
            if (isNaN(value)) {
              message.error("Vui lòng nhập số");
              return;
            }
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
          onMinus={(value) => {
            if (product?.isBatchExpireControl) return;
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
          onPlus={(value) => {
            if (product?.isBatchExpireControl) return;
            onChangeValueProduct(productKey, "realQuantity", +value);
          }}
        />
      ),
    },
    {
      title: "SL lệch",
      dataIndex: "diffQuantity",
      key: "diffQuantity",
      render: (_, { realQuantity, newInventory }) =>
        formatNumber(Math.floor(realQuantity - newInventory)),
    },
    {
      title: "Giá trị lệch",
      dataIndex: "diffAmount",
      key: "diffAmount",
      render: (_, { realQuantity, newInventory, primePrice }) =>
        formatNumber(Math.floor((realQuantity - newInventory) * primePrice)),
    },
  ];

  return (
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="p-5 overflow-x-auto">
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
      />
    </div>
  );
}
