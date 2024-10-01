import { useState } from "react";

import { CustomInput } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";

import { getMarketOrderDetail } from "@/api/market.service";
import { formatMoney } from "@/helpers";
import { branchState, checkInventoryState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { RightContent } from "./rightContent";
import { updateOrderSchema } from "./schema";

export function EditOrder() {
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(updateOrderSchema),
    mode: "onChange",
    defaultValues: {},
  });
  const branchId = useRecoilValue(branchState);
  const [importProducts, setImportProducts] =
    useRecoilState(checkInventoryState);

  const router = useRouter();
  const { id } = router.query;

  const { data: details, isLoading } = useQuery<{ data: any }>(
    ["MARKET_ORDER_DETAIL", id, branchId],
    () => getMarketOrderDetail(String(id)),
    {
      enabled: !!id && !!branchId,
      onSuccess: (data) => {
        if (data?.data?.item) {
          setValue("listProduct", data?.data?.item?.products, {
            shouldValidate: true,
          });
        }
      },
    }
  );

  const columns: any = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      render: (_, record) => record?.marketProduct?.productUnit?.code,
    },
    {
      title: "Tên hàng",
      dataIndex: "products",
      key: "products",
      render: (_, record) => record?.marketProduct?.product?.name,
    },
    {
      title: "ĐVT",
      dataIndex: "units",
      key: "units",
      render: (_, record) => record?.marketProduct?.productUnit?.unitName,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, { marketProductId }) => (
        <CustomInput
          wrapClassName="!w-[110px]"
          className="!h-6 !w-[80px] text-center"
          hasMinus={true}
          hasPlus={true}
          defaultValue={quantity}
          value={quantity}
          type="text"
          onChange={(value) => {
            // validate if value is not a number
            if (isNaN(value)) {
              message.error("Vui lòng nhập số");
              return;
            }
            // update quantity of product
            const newListProduct: any = cloneDeep(getValues("listProduct"));
            const index = newListProduct.findIndex(
              (item) => item.marketProductId === marketProductId
            );
            newListProduct[index].quantity = +value;
            setValue("listProduct", newListProduct, { shouldValidate: true });
          }}
          onMinus={(value) => {
            // update quantity of product
            const newListProduct: any = cloneDeep(getValues("listProduct"));
            const index = newListProduct.findIndex(
              (item) => item.marketProductId === marketProductId
            );
            newListProduct[index].quantity = +value;
            setValue("listProduct", newListProduct, { shouldValidate: true });
          }}
          onPlus={(value) => {
            // update quantity of product
            const newListProduct: any = cloneDeep(getValues("listProduct"));
            const index = newListProduct.findIndex(
              (item) => item.marketProductId === marketProductId
            );
            newListProduct[index].quantity = +value;
            setValue("listProduct", newListProduct, { shouldValidate: true });
          }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => formatMoney(price),
    },
    {
      title: "Thành tiền",
      dataIndex: "diffAmount",
      key: "diffAmount",
      render: (_, record) => formatMoney(record.quantity * record.price),
    },
  ];

  return (
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="p-5 overflow-x-auto">
          <div className="min-w-[1000px]">
            <CustomTable
              dataSource={getValues("listProduct")?.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={columns}
              pagination={false}
              loading={isLoading}
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
        detail={details?.data?.item}
        id={id}
        products={getValues("listProduct")}
      />
    </div>
  );
}
