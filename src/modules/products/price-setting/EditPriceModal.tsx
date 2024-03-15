import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { updatePriceSetting } from '@/api/price-setting.service';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { EDiscountType } from '@/enums';
import { formatNumber } from '@/helpers';
import { branchState } from '@/recoil/state';

enum ECalculatorType {
  ADD = 1,
  MINUS = 2,
}

export function EditPriceModal({
  isOpen,
  onCancel,
  batchId,
  productName,
  price,
}: {
  isOpen: boolean;
  onCancel: () => void;
  batchId?: number;
  productName?: string;
  price?: number;
}) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const [newPrice, setNewPrice] = useState<number>();
  const [calculatorType, setCalculatorType] = useState(ECalculatorType.ADD);
  const [discountType, setDiscountType] = useState(EDiscountType.MONEY);
  const [discountValue, setDiscountValue] = useState(0);
  const [isApplyForAll, setIsApplyForAll] = useState(false);

  useEffect(() => {
    setNewPrice(price);
  }, [price]);

  const { mutate: mutateCreateBatch, isLoading: isLoadingCreateBatch } =
    useMutation(
      () =>
        updatePriceSetting(Number(batchId), {
          type: discountType,
          value:
            calculatorType === ECalculatorType.ADD
              ? discountValue
              : -discountValue,
          isApplyForAll,
          branchId,
        }),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['LIST_PRICE_SETTING']);
          onCancel();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateBatch();
  };

  useEffect(() => {
    if (price) {
      if (calculatorType === ECalculatorType.ADD) {
        if (discountType === EDiscountType.MONEY) {
          setNewPrice(price + Number(discountValue ?? 0));
        } else if (discountType === EDiscountType.PERCENT) {
          setNewPrice(price + (price * Number(discountValue ?? 0)) / 100);
        }
      }

      if (calculatorType === ECalculatorType.MINUS) {
        if (discountType === EDiscountType.MONEY) {
          setNewPrice(price - Number(discountValue ?? 0));
        } else if (discountType === EDiscountType.PERCENT) {
          setNewPrice(price - (price * Number(discountValue ?? 0)) / 100);
        }
      }
    }
  }, [discountType, discountValue, calculatorType]);

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={productName}
      width={620}
      onSubmit={onSubmit}
      isLoading={isLoadingCreateBatch}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5 flex items-center gap-x-2 font-medium">
        <div>
          Giá mới{' '}
          <span className="text-[#05A660]">[{formatNumber(newPrice)}]</span> ={' '}
        </div>
        <CustomInput
          onChange={() => {}}
          value={price}
          className="text-center"
          wrapClassName="w-[120px]"
          type="number"
          bordered={false}
          readOnly
        />
        <div className="flex rounded border border-[#F2F2F5]">
          <div
            onClick={() => setCalculatorType(ECalculatorType.ADD)}
            className={cx(
              {
                'bg-[#3E7BFA] ': calculatorType === ECalculatorType.ADD,
              },
              'px-3 py-2 text-[#3E7BFA] cursor-pointer',
              'rounded-tl rounded-bl'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
            >
              <path
                d="M5 9.5L5 1.5"
                stroke={
                  calculatorType === ECalculatorType.ADD ? 'white' : '#3E7BFA'
                }
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M1 5.5H9"
                stroke={
                  calculatorType === ECalculatorType.ADD ? 'white' : '#3E7BFA'
                }
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            onClick={() => setCalculatorType(ECalculatorType.MINUS)}
            className={cx(
              {
                'bg-[#3E7BFA] ': calculatorType === ECalculatorType.MINUS,
              },
              'px-3 py-2 cursor-pointer flex justify-center items-center',
              'rounded-tr rounded-br'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="3"
              viewBox="0 0 10 3"
              fill="none"
            >
              <path
                d="M1 1.5H9"
                stroke={
                  calculatorType === ECalculatorType.MINUS ? 'white' : '#3E7BFA'
                }
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <CustomInput
          placeholder="Nhập giá trị"
          onChange={(e) => setDiscountValue(e)}
          type="number"
          wrapClassName="w-[120px]"
          className="text-center"
          bordered={false}
          value={discountValue}
        />
        <div className="flex rounded border border-[#F2F2F5]">
          <div
            onClick={() => setDiscountType(EDiscountType.MONEY)}
            className={cx(
              {
                'bg-[#3E7BFA] !text-white':
                  discountType === EDiscountType.MONEY,
              },
              'px-3 py-1 text-[#3E7BFA] cursor-pointer',
              'rounded-tl rounded-bl'
            )}
          >
            VNĐ
          </div>
          <div
            onClick={() => setDiscountType(EDiscountType.PERCENT)}
            className={cx(
              {
                'bg-[#3E7BFA] !text-white':
                  discountType === EDiscountType.PERCENT,
              },
              'px-3 py-1 text-[#3E7BFA] cursor-pointer flex justify-center items-center',
              'rounded-tr rounded-br'
            )}
          >
            %
          </div>
        </div>
      </div>

      <div className="mb-10 flex items-center gap-x-3">
        <CustomCheckbox onChange={(e) => setIsApplyForAll(e.target.checked)} />
        <div>Áp dụng công thức cho tất cả sản phẩm trong bảng giá</div>
      </div>
    </CustomModal>
  );
}
