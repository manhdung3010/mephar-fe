import cx from "classnames";
import Image from "next/image";

import DeleteRedIcon from "@/assets/deleteRed.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import { CustomInput } from "@/components/CustomInput";

import { EDiscountUnit } from "../Info";
import { useState } from "react";
import InputError from "@/components/InputError";

export const BillGiftPoint = ({ setValue, getValues, errors }: { setValue: any; getValues: any; errors: any }) => {
  const [rows, setRows] = useState([
    {
      from: 0,
      discountValue: 0,
      discountType: EDiscountUnit.MONEY,
    },
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        from: 0,
        discountValue: 0,
        discountType: EDiscountUnit.MONEY,
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
          discountValue: 1,
          discountType: EDiscountUnit.MONEY,
        },
      },
    ]);
  };

  const handleDeleteRow = (indexToDelete) => {
    if (getValues("items").length === 1) return; // Prevent deleting the last row
    // setRows(prevRows => prevRows.filter((_, index) => index !== indexToDelete));

    // // Update value items
    // const newRowFormat = rows.filter((_, index) => index !== indexToDelete).map(row => ({
    //   condition: {
    //     order: {
    //       from: row.from
    //     }
    //   },
    //   apply: {
    //     discountValue: 1,
    //     discountType: row.discountType
    //   }
    // }));
    // setValue('items', newRowFormat);

    // delete row index keep old data
    const newRowFormat = getValues("items").filter((_, index) => index !== indexToDelete);
    setValue("items", newRowFormat, { shouldValidate: true });
  };

  const handleChangeRow = (index, key, value) => {
    // const newRows: any = [...rows];
    // newRows[index][key] = value;
    // setRows(newRows);

    // const newRowFormat = newRows.map(row => ({
    //   condition: {
    //     order: {
    //       from: row.from
    //     }
    //   },
    //   apply: {
    //     pointValue: row.pointValue,
    //     discountValue: 1,
    //     discountType: row.discountType
    //   }
    // }));

    // setValue('items', newRowFormat);

    const newRowFormat = getValues("items").map((row, rowIndex) => {
      if (rowIndex === index) {
        return {
          ...row,
          condition: {
            order: {
              ...row.condition.order,
              [key]: value,
            },
            product: {
              from: 1,
            },
          },
          apply: {
            ...row.apply,
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
          <div className="flex-[2] p-4 font-semibold">Tổng tiền hàng</div>
          <div className="flex-[2] p-4 font-semibold">Điểm cộng</div>
          <div className="flex-[2] p-4"></div>
          <div className="flex-1 p-4"></div>
        </div>

        {getValues("items")?.map((row, index) => (
          <div className="flex items-center gap-3 border-b border-gray-100 py-3">
            <div className="flex flex-[2] flex-col px-4">
              <div className="w-full flex items-center gap-x-2">
                Từ
                <CustomInput
                  className="mt-0 h-10"
                  wrapClassName="w-full"
                  value={row?.condition?.order?.from || 0}
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
                <CustomInput
                  className="mt-0 h-10 w-full"
                  wrapClassName="w-full"
                  type="number"
                  value={row?.apply?.pointValue || 0}
                  onChange={(value) => handleChangeRow(index, "pointValue", value)}
                />
              </div>
              {errors?.items && <InputError className="" error={errors?.items[index]?.apply?.pointValue?.message} />}
            </div>
            <div className="flex-[2] px-4">
              <div className="flex h-10 w-fit items-center rounded border border-[#E8EAEB]">
                <div
                  className={cx("h-full w-[50px] text-center rounded flex items-center justify-center cursor-pointer", {
                    "bg-[#3E7BFA] text-white": row?.apply?.discountType === EDiscountUnit.MONEY,
                  })}
                  onClick={() => handleChangeRow(index, "discountType", EDiscountUnit.MONEY)}
                >
                  Điểm
                </div>
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
