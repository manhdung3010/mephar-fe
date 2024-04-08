import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { getBranch } from '@/api/branch.service';
import { getEmployee } from '@/api/employee.service';
import { createMoveProduct } from '@/api/move';
import EditIcon from '@/assets/editIcon.svg';
import EmployeeIcon from '@/assets/employeeIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import { formatNumber } from '@/helpers';
import { productMoveState, profileState } from '@/recoil/state';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';

export function RightContent({ useForm, branchId }: { useForm: any, branchId: number }) {
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

  const { getValues, setValue, handleSubmit, errors, reset } = useForm;

  const [productsImport, setProductsImport] =
    useRecoilState(productMoveState);
  const profile = useRecoilValue(profileState);

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  const { data: branches } = useQuery(['SETTING_BRANCH'], () => getBranch());

  const {
    mutate: mutateCreateProductImport,
    isLoading: isLoadingCreateProductImport,
  } = useMutation(
    () => {
      const products = getValues('products').map(
        ({ isBatchExpireControl, ...product }) => product
      );

      return createMoveProduct({ ...getValues(), products, totalItem });
    },
    {
      onSuccess: async () => {
        // const userId = getValues('userId');
        reset();
        // setValue('userId', userId, { shouldValidate: true });
        setProductsImport([]);
        // await queryClient.invalidateQueries(['LIST_IMPORT_PRODUCT']);
        // router.push('/products/import');
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  useEffect(() => {
    if (profile) {
      setValue('movedBy', profile.id);
    }
  }, [profile])

  const totalPrice = useMemo(() => {
    let price = 0;

    if (productsImport?.length) {
      productsImport.forEach(
        ({ price: unitPrice, quantity, discountValue }) => {
          price += unitPrice * quantity - discountValue;
        }
      );
    }

    return price;
  }, [productsImport]);
  const totalItem = useMemo(() => {
    let quantity = 0;

    if (productsImport?.length) {
      productsImport.forEach(
        ({ quantity: itemQuantity }) => {
          quantity += itemQuantity
        }
      );
    }

    return quantity;
  }, [productsImport]);

  const changePayload = () => {
    const products = cloneDeep(productsImport).map(
      ({ id, price, product, quantity, discountValue, batches }) => ({
        productId: product.id,
        importPrice: price,
        quantity: quantity,
        discount: discountValue,
        productUnitId: id,
        isBatchExpireControl: product.isBatchExpireControl,
        batches: batches?.map(({ id, quantity, expiryDate }) => ({
          id,
          quantity,
          expiryDate,
        })),
      })
    );
    setValue('products', products);
  };

  const onSubmit = () => {
    console.log(getValues());
    // console.log("products", getValues('products'))
    // console.log("userId", getValues('userId'))
    mutateCreateProductImport();
  }

  console.log("errors", errors)

  return (
    <div className="flex h-[calc(100vh-52px)] w-[360px] min-w-[360px] flex-col border-l border-[#E4E4E4] bg-white">
      <div className="px-6 pt-5 ">
        <CustomSelect
          options={employees?.data?.items?.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          showSearch={true}
          value={getValues('movedBy')}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            setValue('movedBy', value, { shouldValidate: true });
          }}
          wrapClassName=""
          className="h-[44px]"
          placeholder="Chọn nhân viên bán hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errors.userId?.message} />
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 grid grid-cols-2">
              <div className=" leading-normal text-[#828487]">
                Mã chuyển hàng
              </div>
              <CustomInput
                bordered={false}
                placeholder="Mã phiếu tự động"
                className="h-6 pr-0 text-end"
                value={getValues('code')}
                onChange={(value) => {
                  setValue('code', value, { shouldValidate: true });
                }}
              />
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Trạng thái</div>
              <div className=" leading-normal text-[#19191C]">Phiếu tạm</div>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng số lượng
              </div>
              <div className=" leading-normal text-[#19191C]">{formatNumber(totalItem)}</div>
            </div>

            <div className="mb-5 flex items-center justify-between">
              <div className=" leading-normal text-[#828487] flex-shrink-0 w-28">
                Tới chi nhánh
              </div>
              <CustomSelect
                options={branches?.data?.items?.filter((br) => br.id !== branchId).map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                value={getValues('toBranchId')}
                onSearch={debounce((value) => {
                  setSearchEmployeeText(value);
                }, 300)}
                onChange={(value) => {
                  setValue('toBranchId', value, { shouldValidate: true });
                }}
                wrapClassName=""
                className="border-underline"
                placeholder="Chọn chi nhánh"
              />
              <InputError error={errors.userId?.message} />
            </div>
          </div>
        </div>

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            value={getValues('note')}
            onChange={(value) => {
              setValue('note', value, { shouldValidate: true });
            }}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="grid grid-cols-2 gap-3 px-6 pb-4">
        <CustomButton className="!h-12 text-lg font-semibold">
          Lưu tạm
        </CustomButton>
        <CustomButton className="!h-12 text-lg font-semibold" type="success" onClick={() => {
          changePayload();
          handleSubmit(onSubmit)();
        }}>
          Hoàn thành
        </CustomButton>
      </div>
    </div>
  );
}
