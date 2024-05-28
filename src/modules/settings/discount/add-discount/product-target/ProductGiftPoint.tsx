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

export const ProductGiftPoint = ({
  setValue,
  getValues,
  errors,
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
      from: 1,
      pointValue: 0,
      pointType: EDiscountUnit.MONEY
    }
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, {
      from: 0,
      pointValue: 0,
      pointType: EDiscountUnit.MONEY
    }]);
    setValue('items', [
      ...getValues('items'),
      {
        condition: {
          order: {
            from: 0
          },
          product: {
            from: 1
          }
        },
        apply: {
          pointValue: 0,
          pointType: EDiscountUnit.MONEY,
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
          from: 1
        },
        product: {
          from: 1
        }
      },
      product: {
        from: row.from
      },
      apply: {
        pointValue: row.pointValue,
        pointType: row.pointType,
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
        product: {
          from: row.from || 1
        },
        order: {
          from: 1
        },
        productUnitId: row.productId,
      },
      apply: {
        discountValue: 1,
        pointValue: row.pointValue,
        pointType: row.pointType,
      }
    }));

    setValue('items', newRowFormat);
  }
  console.log("items", getValues("items"));
  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-[3] p-4 font-semibold">Hàng/Nhóm hàng mua</div>
          <div className="flex-[3] p-4 font-semibold">Điểm cộng</div>
          <div className="flex-1 p-4"></div>
        </div>

        {
          getValues("items")?.map((row, index) => (
            <div className="flex items-center gap-2">
              <div className="flex flex-[3] flex-col px-4">
                <div className='w-full flex items-center gap-x-2'>
                  <CustomInput
                    className="mt-0 h-11 w-14"
                    value={row?.condition?.product?.from || 0}
                    type='number'
                    onChange={(value) => handleChangeRow(index, 'from', value)}
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
                      handleChangeRow(index, 'productId', value)
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
                {
                  errors?.items && <InputError className='' error={errors?.items[index]?.condition?.product?.from?.message} />
                }
              </div>
              <div className="flex flex-[3] flex-col px-4">
                <div className='w-full flex items-center gap-x-2'>
                  <CustomInput
                    className="mt-0 h-11 w-full"
                    wrapClassName="w-full"
                    type='number'
                    value={row?.apply?.pointValue || 0}
                    onChange={(value) => handleChangeRow(index, 'pointValue', value)}
                  />
                  <div className="flex h-11 w-fit items-center rounded border border-[#E8EAEB]">
                    <div
                      className={cx(
                        'h-full w-[50px] text-center rounded-tl rounded-bl flex items-center justify-center cursor-pointer',
                        {
                          'bg-[#3E7BFA] text-white':
                            row?.apply?.pointType === EDiscountUnit.MONEY,
                        }
                      )}
                      onClick={() => handleChangeRow(index, 'pointType', EDiscountUnit.MONEY)}
                    >
                      Điểm
                    </div>
                    <div
                      className={cx(
                        'h-full w-[50px] text-center rounded-tr rounded-br flex items-center justify-center cursor-pointer',
                        {
                          'bg-[#3E7BFA] text-white':
                            row?.apply?.pointType === EDiscountUnit.PERCENT,
                        }
                      )}
                      onClick={() => handleChangeRow(index, 'pointType', EDiscountUnit.PERCENT)}
                    >
                      %
                    </div>
                  </div>
                </div>
                {
                  errors?.items && <InputError className='' error={errors?.items[index]?.apply?.pointType?.message} />
                }
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
