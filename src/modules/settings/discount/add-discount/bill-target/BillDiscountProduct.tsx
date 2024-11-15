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
import { Select, Spin, Tooltip } from "antd";
import { ISaleProduct } from "@/modules/sales/interface";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import { getGroupProduct, getProduct, getSaleProducts } from "@/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { debounce, set } from "lodash";
const { Option } = Select;

export const BillDiscountProduct = ({
  setValue,
  getValues,
  errors,
}: {
  setValue: any;
  getValues: any;
  errors: any;
}) => {
  const branchId = useRecoilValue(branchState);
  const [isProduct, setIsProduct] = useState(true);

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
  const { data: groupProduct, isLoading: isLoadingGroup } = useQuery<{
    data?: any;
  }>(["LIST_GROUP_PRODUCT_DISCOUNT", formFilter.page, formFilter.limit, formFilter.keyword, branchId], () =>
    getGroupProduct(formFilter),
  );

  const [rows, setRows] = useState([
    {
      from: 0,
      discountValue: 0,
      discountType: EDiscountUnit.MONEY,
      type: getValues("type"),
    },
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        from: 0,
        discountValue: 0,
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
        },
        apply: {
          discountValue: 0,
          discountType: EDiscountUnit.MONEY,
          maxQuantity: 1,
          type: getValues("type"),
        },
      },
    ]);
  };

  const handleDeleteRow = (indexToDelete) => {
    if (getValues("items").length === 1) return; // Prevent deleting the last row

    // Update value items
    const newRowFormat = getValues("items").filter((_, index) => index !== indexToDelete);
    setValue("items", newRowFormat, { shouldValidate: true });
  };

  const handleChangeRow = (index, key, value) => {
    const newRowFormat = getValues("items").map((row, rowIndex) => {
      if (rowIndex === index) {
        return {
          ...row,
          condition: {
            order: {
              ...row.condition.order,
              ...(key === "productUnitId" && {}),
              ...(key === "from" && { from: value }),
            },
            product: {
              from: 1,
            },
          },
          apply: {
            ...row.apply,
            type: getValues("type"),
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
          <div className="flex-[2] p-4 font-semibold">Tổng tiền hàng</div>
          <div className="flex-[2] p-4 font-semibold">Giá trị khuyến mại</div>
          <div className="flex-[4] p-4 font-semibold">Hàng được giảm giá</div>
          <div className="flex-1 p-4"></div>
        </div>

        {getValues("items")?.map((row, index) => (
          <div className="flex items-center gap-3 border-b border-gray-100 py-3 overflow-auto">
            <div className="flex flex-[2] flex-col px-4">
              <div className="w-full flex items-center gap-x-2">
                Từ
                <CustomInput
                  className="mt-0 h-10"
                  wrapClassName="w-full"
                  value={row?.condition?.order?.from}
                  type="number"
                  onChange={(value) => handleChangeRow(index, "from", value)}
                />
              </div>
              {errors?.items && (
                <InputError className="ml-6" error={errors?.items[index]?.condition?.order?.from?.message} />
              )}
            </div>
            <div className="flex flex-[2] flex-col px-4">
              <div className="w-full flex items-center gap-x-2">
                Giảm
                <CustomInput
                  className="mt-0 h-10 w-full min-w-[100px]"
                  wrapClassName="w-full"
                  type="number"
                  value={row?.apply?.discountValue || 0}
                  onChange={(value) => handleChangeRow(index, "discountValue", value)}
                />
                <div className="flex h-10 w-fit items-center rounded border border-[#E8EAEB]">
                  <div
                    className={cx(
                      "h-full w-[50px] text-center rounded-tl rounded-bl flex items-center justify-center cursor-pointer",
                      {
                        "bg-[#3E7BFA] text-white": row?.apply?.discountType === EDiscountUnit.MONEY,
                      },
                    )}
                    onClick={() => handleChangeRow(index, "discountType", EDiscountUnit.MONEY)}
                  >
                    VND
                  </div>
                  <div
                    className={cx(
                      "h-full w-[50px] text-center rounded-tr rounded-br flex items-center justify-center cursor-pointer",
                      {
                        "bg-[#3E7BFA] text-white": row?.apply?.discountType === EDiscountUnit.PERCENT,
                      },
                    )}
                    onClick={() => handleChangeRow(index, "discountType", EDiscountUnit.PERCENT)}
                  >
                    %
                  </div>
                </div>
              </div>
              {errors?.items && (
                <InputError className="ml-10" error={errors?.items[index]?.apply?.discountValue?.message} />
              )}
            </div>
            <div className="flex-[4] px-4 flex items-center gap-2">
              <div className="w-24">
                <CustomInput
                  className="h-10 "
                  onChange={(value) => handleChangeRow(index, "maxQuantity", value)}
                  placeholder="Số lượng"
                  value={row?.apply?.maxQuantity}
                  type="number"
                />
                {errors?.items && <InputError className="" error={errors?.items[index]?.apply?.maxQuantity?.message} />}
              </div>
              <div className="w-full">
                <div className="flex gap-2">
                  <Select
                    mode="multiple"
                    className="!rounded w-full overflow-hidden"
                    placeholder={isProduct ? "Nhập tên hàng, sản phẩm..." : "Nhập tên nhóm hàng..."}
                    optionFilterProp="children"
                    showSearch
                    onSearch={debounce((value) => {
                      setFormFilter({
                        ...formFilter,
                        keyword: value,
                      });
                    }, 300)}
                    onChange={(value) => {
                      handleChangeRow(index, isProduct ? "productUnitId" : "groupId", value);
                    }}
                    loading={isLoadingProduct ?? isLoadingGroup}
                    defaultValue={row?.apply?.productUnitId}
                    // suffixIcon={<Image onClick={() => setProductType('group')} src={DocumentIcon} />}
                    value={isProduct ? row?.apply?.productUnitId : row?.apply?.groupId}
                    notFoundContent={
                      isLoadingProduct || isLoadingGroup ? (
                        <Spin size="small" className="flex justify-center p-4 w-full" />
                      ) : null
                    }
                    size="large"
                  >
                    {isProduct
                      ? products?.data?.items?.map((product) => (
                          <Option key={product.id} value={product.productUnit?.id}>
                            {product?.productUnit?.code} - {product?.product?.name} - {product?.productUnit?.unitName}
                          </Option>
                        ))
                      : groupProduct?.data?.items?.map((product) => (
                          <Option key={product.id} value={product?.id}>
                            {product?.name}
                          </Option>
                        ))}
                  </Select>
                  {/* <Tooltip title="Nhóm hàng" className='!w-10 flex-shrink-0'>
                      <Image onClick={() => {
                        setIsProduct(!isProduct)

                      }} src={DocumentIcon} className='cursor-pointer' />
                    </Tooltip> */}
                </div>
                {errors?.items && (
                  <InputError className="" error={errors?.items[index]?.apply?.productUnitId?.message} />
                )}
              </div>
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
