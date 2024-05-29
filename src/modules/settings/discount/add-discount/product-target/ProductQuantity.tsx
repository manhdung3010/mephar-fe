import cx from 'classnames';
import Image from 'next/image';

import DeleteRedIcon from '@/assets/deleteRed.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomInput } from '@/components/CustomInput';

import { getSaleProducts } from '@/api/product.service';
import DocumentIcon from '@/assets/documentIcon.svg';
import InputError from '@/components/InputError';
import { ISaleProduct } from '@/modules/sales/interface';
import { branchState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import { Select, Spin } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { EDiscountUnit } from '../Info';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomButton } from '@/components/CustomButton';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
const { Option } = Select

export const ProductQuantity = ({
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
      pointType: EDiscountUnit.MONEY,
      type: getValues("type")
    }
  ]); // Initialize with one row
  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, {
      from: 0,
      pointValue: 0,
      pointType: EDiscountUnit.MONEY,
      type: getValues("type")
    }]);
    setValue('items', [
      ...getValues('items'),
      {
        condition: {
          order: {
            from: 0
          },
          product: {
            from: 1,
            type: getValues("type")
          }
        },
        apply: {
          pointValue: 0,
          pointType: EDiscountUnit.MONEY,
          type: getValues("type")
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
          from: 1,
          type: getValues("type")
        }
      },
      product: {
        from: row.from
      },
      apply: {
        pointValue: row.pointValue,
        pointType: row.pointType,
        type: getValues("type")
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
          from: row.from,
          type: getValues("type")
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
        type: getValues("type")
      }
    }));

    setValue('items', newRowFormat);
  }
  return (
    <>
      <div className="my-5 flex flex-col gap-2">
        {
          getValues("items")?.map((row, index) => (
            <div className="flex items-baseline gap-2 border-[1px] border-[#d9d9d9] rounded shadow-lg p-8">
              <div className="flex flex-[1] flex-col px-4 font-semibold">
                Khi mua
              </div>
              <div className="flex flex-[5] flex-col px-4 gap-5">
                <div className='w-full flex items-baseline gap-x-2'>
                  <div className='w-full'>
                    <Select
                      mode="multiple"
                      className="!rounded w-full"
                      placeholder='Chọn hàng mua'
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
                </div>
                <div className='flex items-center gap-3'>
                  <span className='font-semibold'>Số lượng từ</span>
                  <CustomInput
                    type="number"
                    className="w-24 h-10"
                    value={row?.condition?.order?.from}
                    onChange={(e) => handleChangeRow(index, 'from', e.target.value)}
                  />
                  <Select
                    className="w-32"
                    value={row?.apply?.pointType}
                    onChange={(value) => handleChangeRow(index, 'pointType', value)}
                    options={[
                      { label: 'Giá bán', value: "TYPE_PRICE" },
                      { label: 'Giảm giá', value: "TYPE_DISCOUNT" },
                    ]}
                    size='large'
                  />

                  <CustomInput
                    type="number"
                    className="w-24 h-10"
                    value={row?.apply?.pointValue}
                    onChange={(e) => handleChangeRow(index, 'pointValue', e.target.value)}
                  />
                  <div className="flex h-10 w-fit items-center rounded border border-[#E8EAEB]">
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
                <div className='w-fit'>
                  <CustomButton
                    prefixIcon={<Image src={PlusIcon} />}
                    type='danger'
                    // onClick={() => router.push('/settings/discount/add-discount')}
                    onClick={() => {
                      // write logic to add a child row

                    }}
                  >
                    Thêm dòng
                  </CustomButton>
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
