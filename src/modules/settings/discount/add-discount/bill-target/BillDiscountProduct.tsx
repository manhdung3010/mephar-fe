import cx from 'classnames';
import Image from 'next/image';

import DeleteRedIcon from '@/assets/deleteRed.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomInput } from '@/components/CustomInput';

import { EDiscountUnit } from '../Info';
import { useState } from 'react';
import SearchIcon from '@/assets/searchIcon.svg';
import DocumentIcon from '@/assets/documentIcon.svg';
import InputError from '@/components/InputError';
import { Select, Spin } from 'antd';
import { ISaleProduct } from '@/modules/sales/interface';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import { getProduct, getSaleProducts } from '@/api/product.service';
import { useQuery } from '@tanstack/react-query';
import { debounce, set } from 'lodash';
const { Option } = Select

export const BillDiscountProduct = ({
  setValue,
  getValues,
  errors,
  isProductPrice = true
}: {
  setValue: any;
  getValues: any;
  errors: any;
  isProductPrice?: boolean
}) => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId
  })

  const { data: products, isLoading: isLoadingProduct, isSuccess } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    [
      'LIST_PRODUCT_DISCOUNT',
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getSaleProducts(formFilter),
  );

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
    setValue('items', [
      ...getValues('items'),
      {
        condition: {
          order: {
            from: 0
          }
        },
        apply: {
          discountValue: 0,
          discountType: EDiscountUnit.MONEY
        }
      }
    ]);
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
        discountType: row.discountType,
        productUnitId: row.productUnitId,
        maxQuantity: row.maxQuantity ?? 1
      }
    }));

    setValue('items', newRowFormat);
  }
  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-[2] p-4 font-semibold">Tên đơn vị</div>
          <div className="flex-[2] p-4 font-semibold">Giá trị khuyến mại</div>
          <div className="flex-[4] p-4 font-semibold">Hàng/Nhóm hàng được giảm giá</div>
          <div className="flex-1 p-4"></div>
        </div>

        {
          getValues("items")?.map((row, index) => (
            <div className="flex items-center gap-3">
              <div className="flex flex-[2] flex-col px-4">
                <div className='w-full flex items-center gap-x-2'>
                  Từ
                  <CustomInput
                    className="mt-0 h-11"
                    wrapClassName="w-full"
                    value={row?.condition?.order?.from || 0}
                    type='number'
                    onChange={(value) => handleChangeRow(index, 'from', value)}
                  />
                </div>
                {
                  errors?.items && <InputError className='ml-6' error={errors?.items[index]?.condition?.order?.from?.message} />
                }
              </div>
              <div className="flex flex-[2] flex-col px-4">
                <div className='w-full flex items-center gap-x-2'>
                  Giảm
                  <CustomInput
                    className="mt-0 h-11 w-full"
                    wrapClassName="w-full"
                    type='number'
                    value={row?.apply?.discountValue || 0}
                    onChange={(value) => handleChangeRow(index, 'discountValue', value)}
                  />
                  <div className="flex h-11 w-fit items-center rounded border border-[#E8EAEB]">
                    <div
                      className={cx(
                        'h-full w-[50px] text-center rounded-tl rounded-bl flex items-center justify-center cursor-pointer',
                        {
                          'bg-[#3E7BFA] text-white':
                            row?.apply?.discountType === EDiscountUnit.MONEY,
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
                            row?.apply?.discountType === EDiscountUnit.PERCENT,
                        }
                      )}
                      onClick={() => handleChangeRow(index, 'discountType', EDiscountUnit.PERCENT)}
                    >
                      %
                    </div>
                  </div>
                </div>
                {
                  errors?.items && <InputError className='ml-10' error={errors?.items[index]?.apply?.discountValue?.message} />
                }
              </div>
              <div className="flex-[4] px-4 flex gap-2">
                <CustomInput
                  className='h-11 w-16'
                  onChange={(value) => handleChangeRow(index, 'maxQuantity', value)}
                  placeholder='Số lượng'
                  value={row?.apply?.maxQuantity}
                  type='number'
                />
                <Select
                  mode="multiple"
                  className="!rounded w-full"
                  placeholder='Nhập tên hàng, sản phẩm, nhóm hàng...'
                  optionFilterProp="children"
                  showSearch
                  onSearch={debounce((value) => {
                    setFormFilter({
                      ...formFilter,
                      keyword: value
                    })
                  }, 300)}
                  onChange={(value) => {
                    handleChangeRow(index, 'productUnitId', value)
                  }}
                  loading={isLoadingProduct}
                  defaultValue={row?.apply?.productUnitId}
                  suffixIcon={<Image src={DocumentIcon} />}
                  value={getValues("times")?.byWeekDay}
                  notFoundContent={isLoadingProduct ? <Spin size="small" className='flex justify-center p-4 w-full' /> : null}
                  size='large'
                >
                  {
                    products?.data?.items?.map((product) => (
                      <Option key={product.id} value={product.productUnit?.id}>
                        {product?.productUnit?.code} - {product?.product?.name} - {product?.productUnit?.unitName}
                      </Option>
                    ))
                  }
                </Select>
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
