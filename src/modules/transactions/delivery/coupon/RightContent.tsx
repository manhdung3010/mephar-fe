import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { getBranch } from '@/api/branch.service';
import { getEmployee } from '@/api/employee.service';
import { createMoveProduct, createReceiveMoveProduct } from '@/api/move';
import EditIcon from '@/assets/editIcon.svg';
import EmployeeIcon from '@/assets/employeeIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import { formatDate, formatDateTime, formatNumber } from '@/helpers';
import { productMoveState, profileState } from '@/recoil/state';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

export function RightContent({ useForm, branchId, moveId, moveDetail }: { useForm: any, branchId: number, moveId: any, moveDetail: any }) {
  const [searchEmployeeText, setSearchEmployeeText] = useState('');
  const router = useRouter()

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
        router.push('/transactions/delivery');
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );
  const {
    mutate: mutateReceiveProductImport,
    isLoading: isLoadingReceiveProductImport,
  } = useMutation(
    () => {
      const products = getValues('items').map(
        ({ isBatchExpireControl, ...product }) => product
      );

      return createReceiveMoveProduct({ ...getValues() }, moveId);
    },
    {
      onSuccess: async () => {
        // const userId = getValues('userId');
        reset();
        // setValue('userId', userId, { shouldValidate: true });
        setProductsImport([]);
        // await queryClient.invalidateQueries(['LIST_IMPORT_PRODUCT']);
        router.push('/transactions/delivery');
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  useEffect(() => {
    if (profile) {
      moveId ? setValue('receivedBy', profile.id) : setValue('movedBy', profile.id);
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
  const totalItemMove = useMemo(() => {
    let quantity = 0;

    if (productsImport?.length) {
      productsImport.forEach(
        ({ totalQuantity }) => {
          quantity += totalQuantity
        }
      );
    }

    return quantity;
  }, [productsImport]);

  const changePayload = () => {
    const products = cloneDeep(productsImport).map(
      ({ id, price, product, quantity, batches, toBatches, productUnitId, productUnit }) => ({
        productId: product.id,
        price: price,
        ...(moveId ? { totalQuantity: quantity } : { quantity: quantity }),
        id: id,
        isBatchExpireControl: product.isBatchExpireControl,
        ...(moveId ? {} : { productUnitId: productUnitId }),
        batches: moveId ? toBatches?.map((item) => (
          {
            id: item.batch.id,
            quantity: item.batch.quantity,
            expiryDate: item.batch.expiryDate,
          }
        )) : batches?.map(({ id, quantity, expiryDate }) => ({
          id,
          quantity,
          expiryDate,
        })),
      })
    );
    moveId ? setValue('items', products) : setValue('products', products);
  };

  const onSubmit = () => {
    if (moveId) {
      mutateReceiveProductImport();
    }
    else {
      mutateCreateProductImport();
    }
  }

  return (
    <div className="flex h-[calc(100vh-52px)] w-[360px] min-w-[360px] flex-col border-l border-[#E4E4E4] bg-white">
      <div className="px-6 pt-5 ">
        <CustomSelect
          options={employees?.data?.items?.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          showSearch={true}
          value={moveId ? getValues('receivedBy') : getValues('movedBy')}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            moveId ? setValue('receivedBy', value, { shouldValidate: true }) : setValue('movedBy', value, { shouldValidate: true });
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
            {
              !moveId && <div className="mb-5 grid grid-cols-2">
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
            }
            {
              moveId && <div className="mb-5 flex justify-between">
                <div className=" leading-normal text-[#828487]">Mã chuyển hàng</div>
                <div className=" leading-normal text-[#19191C]">{moveDetail?.code}</div>
              </div>
            }

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Trạng thái</div>
              <div className=" leading-normal text-[#19191C]">{moveId ? "Nhận hàng" : "Phiếu tạm"}</div>
            </div>
            {
              moveId && (
                <>
                  <div className="mb-5 flex justify-between">
                    <div className=" leading-normal text-[#828487]">Chi nhánh gửi</div>
                    <div className=" leading-normal text-[#19191C]">{moveDetail?.fromBranch?.name}</div>
                  </div>
                  <div className="mb-5 flex justify-between">
                    <div className=" leading-normal text-[#828487]">Ngày chuyển</div>
                    <div className=" leading-normal text-[#19191C]">{formatDate(moveDetail?.movedAt)}</div>
                  </div>
                </>
              )
            }
          </div>

          <div className="mb-5">
            {
              moveId && <div className="mb-5 flex justify-between">
                <div className=" leading-normal text-[#828487]">
                  Tổng số lượng chuyển
                </div>
                <div className=" leading-normal text-[#19191C]">{formatNumber(totalItemMove)}</div>
              </div>
            }
            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng số lượng {moveId ? "nhận" : ""}
              </div>
              <div className=" leading-normal text-[#19191C]">{formatNumber(totalItem)}</div>
            </div>

            {
              !moveId && (
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
              )
            }
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

      <div className="grid grid-cols-1 gap-3 px-6 pb-4">
        {/* <CustomButton className="!h-12 text-lg font-semibold">
          Lưu tạm
        </CustomButton> */}
        <CustomButton className="!h-12 text-lg font-semibold" type="success" onClick={() => {
          changePayload();
          handleSubmit(onSubmit)();
        }}
          loading={isLoadingCreateProductImport || isLoadingReceiveProductImport}
          disabled={isLoadingCreateProductImport || isLoadingReceiveProductImport}
        >
          Hoàn thành
        </CustomButton>
      </div>
    </div>
  );
}
