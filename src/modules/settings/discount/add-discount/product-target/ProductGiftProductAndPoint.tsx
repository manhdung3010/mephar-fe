import cx from "classnames";
import Image from "next/image";
import DeleteRedIcon from "@/assets/deleteRed.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import { CustomInput } from "@/components/CustomInput";
import { EDiscountUnit } from "../Info";
import { useState } from "react";
import SearchIcon from "@/assets/searchIcon.svg";
import DocumentIcon from "@/assets/documentIcon.svg";
import InputError from "@/components/InputError";
import { Select, Spin } from "antd";
import { ISaleProduct } from "@/modules/sales/interface";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import { getProduct, getSaleProducts } from "@/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { debounce, set } from "lodash";
const { Option } = Select;

export const ProductGiftProductAndPoint = ({
  setValue,
  getValues,
  errors,
}: {
  setValue: any;
  getValues: any;
  errors: any;
  isProductPrice?: boolean;
}) => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId,
  });

  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_PRODUCT_DISCOUNT", formFilter.page, formFilter.limit, formFilter.keyword, branchId], () =>
    getSaleProducts(formFilter),
  );

  const [rows, setRows] = useState([
    {
      from: 0,
      discountValue: 1,
      discountType: EDiscountUnit.MONEY,
      type: getValues("type"),
    },
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        from: 0,
        discountValue: 1,
        discountType: EDiscountUnit.MONEY,
        type: getValues("type"),
      },
    ]);
    setValue("items", [
      ...getValues("items"),
      {
        condition: {
          order: {
            from: 0,
          },
          product: {
            from: 1,
            type: getValues("type"),
          },
        },
        apply: {
          isGift: true,
          productUnitId: [],
          maxQuantity: 1,
          discountValue: 1,
          type: getValues("type"),
        },
      },
    ]);
  };

  const handleDeleteRow = (indexToDelete) => {
    if (getValues("items").length === 1) return; // Prevent deleting the last row
    const newRowFormat = getValues("items").filter((_, index) => index !== indexToDelete);
    setValue("items", newRowFormat, { shouldValidate: true });
  };

  const handleChangeRow = (index, key, value) => {
    // const newRows: any = [...rows];
    // newRows[index][key] = value;
    // setRows(newRows);
    // const newRowFormat = newRows.map(row => ({
    //   condition: {
    //     product: {
    //       from: row.from,
    //       type: getValues('type')
    //     },
    //     order: {
    //       from: 1
    //     },
    //     productUnitId: row.productId,
    //   },
    //   apply: {
    //     isGift: true,
    //     productUnitId: row.productUnitId,
    //     maxQuantity: row.maxQuantity ?? 1,
    //     discountValue: 1,
    //     type: getValues('type')
    //   }
    // }));
    // setValue('items', newRowFormat);
    const newRowFormat = getValues("items").map((row, rowIndex) => {
      if (rowIndex === index) {
        return {
          ...row,
          condition: {
            order: {
              from: 1,
            },
            product: {
              ...row.condition.product,
              ...(key === "from" ? { from: value } : {}),
              type: getValues("type"),
            },
            productUnitId: key === "productId" ? value : row?.condition?.productUnitId,
          },
          apply: {
            ...row.apply,
            type: getValues("type"),
            isGift: true,
            discountValue: 1,
            [key]: value,
          },
        };
      }
      return row;
    });
    setValue("items", newRowFormat, { shouldValidate: true });
  };

  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-[3] p-4 font-semibold">Hàng/Nhóm hàng mua</div>
          <div className="flex-[3] p-4 font-semibold">Hàng/nhóm hàng được giảm giá</div>
          <div className="flex-[1] p-4 font-semibold">Điểm tặng</div>
          <div className="flex-1 p-4"></div>
        </div>
        {getValues("items")?.map((row, index) => (
          <div className="flex items-center gap-2 border-b border-gray-100 py-3">
            <div className="flex flex-[3] flex-col px-4">
              <div className="w-full flex items-center gap-x-2">
                <div className="w-40">
                  <CustomInput
                    className="mt-0 h-10"
                    value={row?.condition?.product?.from || 0}
                    type="number"
                    onChange={(value) => handleChangeRow(index, "from", value)}
                  />
                  {errors?.items && (
                    <InputError className="" error={errors?.items[index]?.condition?.product?.from?.message} />
                  )}
                </div>
                <div className="w-full">
                  <Select
                    mode="multiple"
                    className="!rounded w-full"
                    placeholder="Nhập tên hàng, sản phẩm, nhóm hàng..."
                    optionFilterProp="children"
                    showSearch
                    onSearch={debounce((value) => {
                      setFormFilter({
                        ...formFilter,
                        keyword: value,
                      });
                    }, 300)}
                    onChange={(value) => {
                      handleChangeRow(index, "productId", value);
                    }}
                    loading={isLoadingProduct}
                    defaultValue={row?.condition?.productUnitId}
                    // suffixIcon={<Image src={DocumentIcon} />}
                    value={row?.condition?.productUnitId}
                    notFoundContent={
                      isLoadingProduct ? <Spin size="small" className="flex justify-center p-4 w-full" /> : null
                    }
                    size="large"
                  >
                    {products?.data?.items?.map((product) => (
                      <Option key={product.id} value={product.productUnit?.id}>
                        {product?.productUnit?.code} - {product?.product?.name} - {product?.productUnit?.unitName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex-[3] px-4 flex items-center gap-2">
              <div className="w-24">
                <CustomInput
                  className="h-10"
                  onChange={(value) => handleChangeRow(index, "maxQuantity", value)}
                  placeholder="Số lượng"
                  value={row?.apply?.maxQuantity}
                  type="number"
                />
                {errors?.items && <InputError className="" error={errors?.items[index]?.apply?.maxQuantity?.message} />}
              </div>
              <div className="w-full">
                <Select
                  mode="multiple"
                  className="!rounded w-full"
                  placeholder="Nhập tên hàng, sản phẩm, nhóm hàng..."
                  optionFilterProp="children"
                  showSearch
                  onSearch={debounce((value) => {
                    setFormFilter({
                      ...formFilter,
                      keyword: value,
                    });
                  }, 300)}
                  onChange={(value) => {
                    handleChangeRow(index, "productUnitId", value);
                  }}
                  loading={isLoadingProduct}
                  defaultValue={row?.apply?.productUnitId}
                  suffixIcon={<Image src={DocumentIcon} />}
                  value={row?.apply?.productUnitId}
                  notFoundContent={
                    isLoadingProduct ? <Spin size="small" className="flex justify-center p-4 w-full" /> : null
                  }
                  size="large"
                >
                  {products?.data?.items?.map((product) => (
                    <Option key={product.id} value={product.productUnit?.id}>
                      {product?.productUnit?.code} - {product?.product?.name} - {product?.productUnit?.unitName}
                    </Option>
                  ))}
                </Select>
                {errors?.items && (
                  <InputError className="" error={errors?.items[index]?.apply?.productUnitId?.message} />
                )}
              </div>
            </div>
            <div
              onClick={() => handleDeleteRow(index)}
              className="flex flex-1 items-center justify-center px-4 cursor-pointer"
            >
              <CustomInput onChange={() => {}} />
            </div>
            <div
              onClick={() => handleDeleteRow(index)}
              className="flex flex-1 items-center justify-center px-4 cursor-pointer"
            >
              <Image src={DeleteRedIcon} alt="" />
            </div>
          </div>
        ))}
      </div>

      <div onClick={handleAddRow} className="flex gap-3 text-[16px] font-semibold text-[#D64457] cursor-pointer w-40">
        <Image src={PlusCircleIcon} alt="" />
        <div>Thêm điều kiện</div>
      </div>
    </>
  );
};
