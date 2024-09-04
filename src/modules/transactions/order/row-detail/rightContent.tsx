import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import CopyIcon from '@/assets/copyIcon.svg';
import EditIcon from '@/assets/editIcon.svg';
import PlusIcon from '@/assets/plusIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEmployee } from '@/api/employee.service';
import { debounce } from 'lodash';
import EmployeeIcon from '@/assets/employeeIcon.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { branchState, checkInventoryState, profileState } from '@/recoil/state';
import { formatNumber } from '@/helpers';
import { message } from 'antd';
import { createCheckInventory } from '@/api/check-inventory';
import { useRouter } from 'next/router';
import InputError from '@/components/InputError';

export function RightContent({ getValues, setValue, errors, handleSubmit, reset }: any) {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [importProducts, setImportProducts] =
    useRecoilState(checkInventoryState);
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  const totalQuantity = useMemo(() => {
    let total = 0;
    importProducts.forEach((item: any) => {
      total += item.realQuantity;
    });
    return total;
  }, [importProducts]);

  useEffect(() => {
    if (profile) {
      setValue('userCreateId', profile.id);
    }
  }, [profile]);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } =
    useMutation(
      () => {
        return createCheckInventory({
          ...getValues(),
          branchId,
        });
      },
      {
        onSuccess: async (res) => {
          reset();
          router.push(`/products/check-inventory`);
          setImportProducts([]);
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );


  const onSubmit = () => {
    mutateCreateOrder()
    // console.log("value", getValues());
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
          value={getValues('userCreateId')}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            setValue('userCreateId', value, { shouldValidate: true });
          }}
          wrapClassName=""
          className="h-[44px]"
          placeholder="Chọn nhân viên kiểm hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errors.userCreateId?.message} />
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 grid grid-cols-2">
              <div className=" leading-normal text-[#828487]">
                Mã kiểm kho
              </div>
              <CustomInput
                bordered={false}
                placeholder="Mã phiếu tự động"
                className="h-6 pr-0 text-end"
                onChange={() => { }}
              />
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Trạng thái</div>
              <div className=" leading-normal text-[#19191C]">Phiếu tạm</div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng SL thực tế
              </div>
              <div className=" leading-normal text-[#19191C]">{formatNumber(totalQuantity)}</div>
            </div>
          </div>

          {/* <div className="mb-5">
            <div className="mb-5 font-medium">KIẾM GẦN ĐÂY</div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487] ">
                Bạch đái hoàn Xuân quang
              </div>
              <Image src={CopyIcon} />
            </div>
          </div> */}
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
        <CustomButton onClick={() => {
          const formatProducts = importProducts.map((item: any) => ({
            productUnitId: item.id,
            ...(item?.batches?.length <= 0 && {
              realQuantity: item.realQuantity,
            }),
            // isBatchExpireControl: item.product?.isBatchExpireControl,
            ...(item?.batches?.length > 0 && {
              inventoryCheckingBatch: item.batches.filter((b) => b.isSelected).map((batch) => {
                return {
                  batchId: batch.id,
                  realQuantity: batch.quantity,
                };

              })
            })
          }));

          setValue('products', formatProducts, { shouldValidate: true });
          handleSubmit(onSubmit)();
        }}
          className="!h-12 text-lg font-semibold" type="success">
          Hoàn thành
        </CustomButton>
      </div>
    </div>
  );
}
