import cx from 'classnames';
import Image from 'next/image';

import DeleteRedIcon from '@/assets/deleteRed.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomInput } from '@/components/CustomInput';

import { EDiscountUnit } from './Info';
import { useState } from 'react';

export const BillDiscount = ({
  setValue,
  getValues,
  errors,
}: {
  setValue: any;
  getValues: any;
  errors: any;
}) => {

  const [rows, setRows] = useState([
    {
      from: 0,
      discountValue: 0,
      discountType: EDiscountUnit.MONEY
    }
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, {
      from: 0,
      discountValue: 0,
      discountType: EDiscountUnit.MONEY
    }]);
  };

  const handleDeleteRow = (indexToDelete) => {
    if (rows.length === 1) return; // Prevent deleting the last row
    setRows(prevRows => prevRows.filter((_, index) => index !== indexToDelete));

    // Update value items
    const newRowFormat = rows.filter((_, index) => index !== indexToDelete).map(row => ({
      condition: {
        order: {
          from: row.from
        }
      },
      apply: {
        discountValue: row.discountValue,
        discountType: row.discountType
      }
    }));
    setValue('items', newRowFormat);
  };

  const handleChangeRow = (index, key, value) => {
    const newRows: any = [...rows];
    newRows[index][key] = value;
    setRows(newRows);

    const newRowFormat = newRows.map(row => ({
      condition: {
        order: {
          from: row.from
        }
      },
      apply: {
        discountValue: row.discountValue,
        discountType: row.discountType
      }
    }));

    setValue('items', newRowFormat);
  }
  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-[2] p-4">Tên đơn vị</div>
          <div className="flex-[2] p-4">Giá trị quy đổi</div>
          <div className="flex-[2] p-4"></div>
          <div className="flex-1 p-4"></div>
        </div>

        {
          rows.map((row, index) => (
            <div className="flex gap-3">
              <div className="flex flex-[2] items-center gap-2 px-4">
                Từ
                <CustomInput
                  className="mt-0 h-11"
                  wrapClassName="w-full"
                  value={row.from}
                  type='number'
                  onChange={(value) => handleChangeRow(index, 'from', value)}
                />
              </div>
              <div className="flex flex-[2] items-center gap-2 px-4">
                Giảm
                <CustomInput
                  className="mt-0 h-11 w-full"
                  wrapClassName="w-full"
                  type='number'
                  value={row.discountValue}
                  onChange={(value) => handleChangeRow(index, 'discountValue', value)}
                />
              </div>
              <div className="flex-[2] px-4">
                <div className="flex h-full w-fit items-center rounded border border-[#E8EAEB]">
                  <div
                    className={cx(
                      'h-full w-[50px] text-center rounded-tl rounded-bl flex items-center justify-center cursor-pointer',
                      {
                        'bg-[#3E7BFA] text-white':
                          row.discountType === EDiscountUnit.MONEY,
                      }
                    )}
                    onClick={() => handleChangeRow(index, 'discountType', EDiscountUnit.MONEY)}
                  >
                    VND
                  </div>
                  <div
                    className={cx(
                      'h-full w-[50px] text-center rounded-tr rounded-br flex items-center justify-center cursor-pointer',
                      {
                        'bg-[#3E7BFA] text-white':
                          row.discountType === EDiscountUnit.PERCENT,
                      }
                    )}
                    onClick={() => handleChangeRow(index, 'discountType', EDiscountUnit.PERCENT)}
                  >
                    %
                  </div>
                </div>
              </div>
              <div onClick={() => handleDeleteRow(index)} className="flex flex-1 items-center justify-center px-4 cursor-pointer">
                <Image src={DeleteRedIcon} alt="" />
              </div>
            </div>
          ))
        }
      </div>

      <div onClick={handleAddRow} className="flex gap-3 text-[16px] font-semibold text-[#D64457] cursor-pointer w-40">
        <Image src={PlusCircleIcon} alt="" />
        <div>Thêm điều kiện</div>
      </div>
    </>
  );
};
