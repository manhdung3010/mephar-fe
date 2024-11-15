import cx from "classnames";
import Image from "next/image";

import DeleteRedIcon from "@/assets/deleteRed.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import { CustomInput } from "@/components/CustomInput";

import { getSaleProducts } from "@/api/product.service";
import DocumentIcon from "@/assets/documentIcon.svg";
import InputError from "@/components/InputError";
import { ISaleProduct } from "@/modules/sales/interface";
import { branchState } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { EDiscountUnit } from "../Info";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useRouter } from "next/router";
const { Option } = Select;

export const ProductQuantity = ({
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
  const router = useRouter();
  const { id } = router.query;

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99999,
    keyword: "",
    branchId,
  });

  const [typePrice, setTypePrice] = useState(1);

  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_PRODUCT_DISCOUNT", formFilter.page, formFilter.limit, formFilter.keyword, branchId], () =>
    getSaleProducts(formFilter),
  );

  useEffect(() => {
    const itemsConditionProductUnitId = getValues("items")?.condition?.productUnitId;

    setValue(itemsConditionProductUnitId);
  }, [getValues]);

  const [rows, setRows] = useState([
    {
      from: 1,
      pointValue: 0,
      pointType: EDiscountUnit.MONEY,
      type: getValues("type"),
    },
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        from: 0,
        pointValue: 0,
        pointType: EDiscountUnit.MONEY,
        type: getValues("type"),
      },
    ]);
    setValue("items", [
      ...getValues("items"),
      {
        condition: {
          order: {
            from: 1,
          },
          product: {
            from: 1,
            type: getValues("type"),
          },
        },
        apply: {
          pointValue: 0,
          pointType: EDiscountUnit.MONEY,
          type: getValues("type"),
        },
        childItems: [
          {
            condition: {
              product: {
                from: 1,
              },
              productUnitId: [],
            },
            apply: {
              changeType: "TYPE_PRICE",
              fixedPrice: 0,
            },
          },
        ],
      },
    ]);
  };

  const handleDeleteRow = (indexToDelete) => {
    if (rows.length === 1) return; // Prevent deleting the last row
    setRows((prevRows) => prevRows.filter((_, index) => index !== indexToDelete));

    // Update value items
    const newRowFormat = rows
      .filter((_, index) => index !== indexToDelete)
      .map((row: any) => ({
        condition: {
          order: {
            from: 1,
          },
          product: {
            from: 1,
            type: getValues("type"),
          },
        },
        product: {
          from: row.from,
        },
        apply: {
          pointValue: row.pointValue,
          pointType: row.pointType,
          type: getValues("type"),
        },
        childItems: row.childItems,
      }));
    setValue("items", newRowFormat);
  };

  const handleChangeRow = (value, index) => {
    const newRows: any = [...getValues("items")];
    newRows[index].condition.productUnitId = value;
    setRows(newRows);
    setValue("items", newRows);
  };

  console.log("getValues", getValues());

  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        {getValues("items")?.map((row, index) => (
          <div className="flex items-center gap-2 border-[1px] border-[#d9d9d9] rounded shadow-lg p-8">
            <div className="flex flex-[1] flex-col px-4 font-semibold">Khi mua</div>
            <div className="flex flex-[5] flex-col px-4 gap-5">
              <div className="w-full flex items-center gap-x-2">
                <div className="w-full">
                  <Select
                    mode="multiple"
                    className="!rounded w-full"
                    placeholder="Chọn hàng mua"
                    optionFilterProp="children"
                    showSearch
                    onSearch={debounce((value) => {
                      setFormFilter({
                        ...formFilter,
                        keyword: value,
                      });
                    }, 300)}
                    onChange={(value) => {
                      // change row of items
                      const newRows: any = [...getValues("items")];
                      newRows[index].condition.productUnitId = value;
                      newRows[index].apply.productUnitId = value;
                      setRows(newRows);
                      setValue("items", newRows);
                    }}
                    loading={isLoadingProduct}
                    defaultValue={row?.apply?.productUnitId}
                    // suffixIcon={<Image src={DocumentIcon} />}
                    value={
                      getValues("items")?.condition?.productUnitId
                        ? getValues("items")?.condition?.productUnitId
                        : row?.condition?.productUnitId
                    }
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
              {row?.childItems?.map((childItem, childIndex) => (
                <div className="flex items-center gap-3" key={childIndex}>
                  <span className="font-semibold">Số lượng từ</span>
                  <CustomInput
                    type="number"
                    className="w-24 h-10"
                    value={childItem?.condition?.product?.from}
                    onChange={(value) => {
                      // change row of childItems
                      const newRows: any = [...getValues("items")];
                      newRows[index].childItems[childIndex].condition.product.from = value;
                      setRows(newRows);
                      setValue("items", newRows);
                    }}
                  />
                  <Select
                    className="w-32"
                    value={childItem?.apply?.changeType}
                    defaultValue={childItem?.apply?.changeType}
                    onChange={(value) => {
                      // change row of childItems
                      console.log("value", value);
                      const newRows: any = [...getValues("items")];
                      newRows[index].childItems[childIndex].apply.changeType = value;
                      setRows(newRows);
                      console.log("newRows", newRows);
                      setValue("items", newRows);
                    }}
                    options={[
                      { label: "Giá bán", value: "TYPE_PRICE" },
                      { label: "Giảm giá", value: "TYPE_DISCOUNT" },
                    ]}
                    size="large"
                  />

                  <CustomInput
                    type="number"
                    className="w-24 h-10"
                    value={childItem?.apply?.fixedPrice}
                    onChange={(value) => {
                      // change row of childItems
                      const newRows: any = [...getValues("items")];
                      newRows[index].childItems[childIndex].apply.fixedPrice = value;
                      setRows(newRows);
                      setValue("items", newRows);
                    }}
                  />
                  {childItem?.apply?.changeType === "TYPE_DISCOUNT" && (
                    <div className="flex h-10 w-fit items-center rounded border border-[#E8EAEB]">
                      <div
                        className={cx(
                          "h-full w-[50px] text-center rounded-tl rounded-bl flex items-center justify-center cursor-pointer",
                          {
                            "bg-[#3E7BFA] text-white": typePrice === 1,
                          },
                        )}
                        onClick={() => {
                          // change row of childItems
                          // const newRows: any = [...getValues('items')];
                          // newRows[index].childItems[childIndex].apply.changeType = "TYPE_PRICE";
                          // setRows(newRows);
                          // setValue('items', newRows);

                          setTypePrice(1);
                        }}
                      >
                        Đồng
                      </div>
                      {/* <div
                              className={cx(
                                'h-full w-[50px] text-center rounded-tr rounded-br flex items-center justify-center cursor-pointer',
                                {
                                  'bg-[#3E7BFA] text-white':
                                    typePrice === "TYPE_DISCOUNT",
                                }
                              )}
                              onClick={() => {
                                // change row of childItems
                                // const newRows: any = [...getValues('items')];
                                // newRows[index].childItems[childIndex].apply.changeType = "TYPE_PRICE";
                                // setRows(newRows);
                                // setValue('items', newRows);
                              }}
                            >
                              %
                            </div> */}
                    </div>
                  )}
                  <div
                    className={`${id ? "cursor-not-allowed" : "cursor-pointer"} ml-5`}
                    onClick={() => {
                      // remove row from childItems
                      if (id) return;
                      const newRows: any = [...getValues("items")];
                      // check if childItems have more than 1 item then remove
                      if (newRows[index].childItems.length > 1) {
                        newRows[index].childItems = newRows[index].childItems.filter((_, i) => i !== childIndex);
                        setRows(newRows);
                        setValue("items", newRows);
                      }
                    }}
                  >
                    <Image src={DeleteRedIcon} alt="" />
                  </div>
                </div>
              ))}
              <div className={`w-fit ${id ? "cursor-not-allowed" : "cursor-pointer"}`}>
                <div
                  onClick={() => {
                    // add new row to childItems
                    if (id) return;
                    const newRows: any = [...getValues("items")];
                    if (!newRows[index].childItems) {
                      newRows[index].childItems = [
                        {
                          condition: {
                            product: {
                              from: 1,
                              type: getValues("type"),
                            },
                          },
                          apply: {
                            changeType: "TYPE_PRICE",
                            fixedPrice: 0,
                          },
                        },
                      ];
                    }
                    newRows[index].childItems.push({
                      condition: {
                        product: {
                          from: 1,
                          type: getValues("type"),
                        },
                      },
                      apply: {
                        changeType: "TYPE_PRICE",
                        fixedPrice: 0,
                      },
                    });
                    setRows(newRows);
                    setValue("items", newRows);
                  }}
                  className="flex gap-2 text-[16px] font-semibold text-[#D64457]"
                >
                  <Image src={PlusCircleIcon} alt="" />
                  <div>Thêm dòng</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                if (id) return;
                handleDeleteRow(index);
              }}
              className={`flex flex-1 items-center justify-center px-4 ${id ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Image src={DeleteRedIcon} alt="" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-fit">
        <CustomButton
          prefixIcon={<Image src={PlusIcon} />}
          type="danger"
          onClick={handleAddRow}
          disabled={id ? true : false}
        >
          Thêm điều kiện
        </CustomButton>
      </div>
    </>
  );
};
