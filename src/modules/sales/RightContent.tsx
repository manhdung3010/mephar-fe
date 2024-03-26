import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import cx from 'classnames';
import { cloneDeep, debounce, set } from 'lodash';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getCustomer } from '@/api/customer.service';
import { getEmployee } from '@/api/employee.service';
import { createOrder } from '@/api/order.service';
import CustomerIcon from '@/assets/customerIcon.svg';
import DolarIcon from '@/assets/dolarIcon.svg';
import EditIcon from '@/assets/editIcon.svg';
import EmployeeIcon from '@/assets/employeeIcon.svg';
import Bank from '@/assets/images/bank.png';
import Cash from '@/assets/images/cash.png';
import Debt from '@/assets/images/debt.png';
import PlusIcon from '@/assets/plusIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import {
  EDiscountLabel,
  EDiscountType,
  EPaymentMethod,
  getEnumKeyByValue,
} from '@/enums';
import { formatMoney } from '@/helpers';
import {
  branchState,
  orderActiveState,
  orderState,
  profileState,
} from '@/recoil/state';

import { CreateCustomerModal } from './CreateCustomerModal';
import { CreateDiscountModal } from './CreateDiscountModal';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import type { ISaleProductLocal } from './interface';
import { OrderSuccessModal } from './OrderSuccessModal';
import { ScanQrModal } from './ScanQrModal';
import { RightContentStyled } from './styled';

export function RightContent({ useForm }: { useForm: any }) {
  const queryClient = useQueryClient();

  const { getValues, setValue, handleSubmit, errors, reset } = useForm;

  const [orderObject, setOrderObject] = useRecoilState(orderState);
  const [orderActive, setOrderActive] = useRecoilState(orderActiveState);

  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [isOpenScanQrModal, setIsOpenScanQrModal] = useState(false);
  const [isOpenOrderSuccessModal, setIsOpenOrderSuccessModal] = useState(false);

  const [isOpenPrescriptionModal, setIsOpenPrescriptionModal] = useState(false);
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);
  const [isOpenAddDiscountModal, setIsOpenAddDiscountModal] = useState(false);

  const [searchEmployeeText, setSearchEmployeeText] = useState('');
  const [searchCustomerText, setSearchCustomerText] = useState('');
  const [saleInvoice, setSaleInvoice] = useState();

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );
  const { data: customers } = useQuery(
    ['CUSTOMER_LIST', searchCustomerText],
    () => getCustomer({ page: 1, limit: 20, keyword: searchCustomerText })
  );

  useEffect(() => {
    if (profile) {
      setValue('userId', profile.id);
    }
  }, [profile]);

  useEffect(() => {
    const orderKeys = Object.keys(orderObject);

    if (!orderActive || !orderKeys.includes(orderActive)) {
      setOrderActive(`${orderKeys[0]}`);
    }
  }, [orderActive]);

  const totalPrice = useMemo(() => {
    let price = 0;

    orderObject[orderActive]?.forEach((product: ISaleProductLocal) => {
      const unit = product.product.productUnit.find(
        (unit) => unit.id === product.productUnitId
      );

      price += Number(unit?.price ?? 0) * product.quantity;
    });

    return price;
  }, [orderObject, orderActive]);

  const discount = useMemo(() => {
    if (getValues('discount')) {
      const discountValue = Number(getValues('discount')).toLocaleString(
        'en-US'
      );
      const discountType =
        EDiscountLabel[
        getEnumKeyByValue(EDiscountType, getValues('discountType'))
        ];

      return `${discountValue}${discountType}`;
    }

    return '';
  }, [getValues('discount'), getValues('discountType')]);

  const customerMustPay = useMemo(() => {
    if (getValues('discount')) {
      if (getValues('discountType') === EDiscountType.MONEY) {
        return totalPrice > Number(getValues('discount'))
          ? totalPrice - Number(getValues('discount'))
          : 0;
      }

      if (getValues('discountType') === EDiscountType.PERCENT) {
        const discountValue =
          (totalPrice * Number(getValues('discount'))) / 100;
        return totalPrice > discountValue ? totalPrice - discountValue : 0;
      }
    }

    return totalPrice;
  }, [totalPrice, getValues('discount'), getValues('discountType')]);

  const returnPrice = useMemo(() => {
    if (getValues('cashOfCustomer')) {
      return Number(getValues('cashOfCustomer')) - customerMustPay;
    }

    return 0;
  }, [customerMustPay, getValues('cashOfCustomer')]);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } =
    useMutation(
      () => {
        const formatProducts = getValues('products')?.map(
          ({ isBatchExpireControl, ...product }) => ({
            ...product,
            batches: product.batches?.map((batch) => ({
              id: batch.id,
              quantity: batch.quantity,
            })),
          })
        );

        return createOrder({
          ...getValues(),
          products: formatProducts,
          branchId,
        });
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(['LIST_SALE_PRODUCT']);
          if (res.data) {
            setSaleInvoice(res.data);
          }

          const orderClone = cloneDeep(orderObject);

          orderClone[orderActive] = [];

          setOrderObject(orderClone);

          if (getValues('paymentType') === EPaymentMethod.BANKING) {
            setIsOpenScanQrModal(true);
          } else {
            setIsOpenOrderSuccessModal(true);
          }

          reset();
          setValue('userId', profile.id, { shouldValidate: true });
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateOrder();
  };

  return (
    <RightContentStyled className="flex w-[360px] min-w-[360px] flex-col">
      <div className="px-6 pt-5 ">
        <CustomSelect
          options={employees?.data?.items?.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          showSearch={true}
          value={getValues('userId')}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            setValue('userId', value, { shouldValidate: true });
          }}
          wrapClassName=""
          className="h-[44px]"
          placeholder="Chọn nhân viên bán hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errors.userId?.message} />

        <CustomSelect
          options={customers?.data?.items?.map((item) => ({
            value: item.id,
            label: item.fullName + " - " + item.phone,
          }))}
          value={getValues('customerId')}
          onSearch={debounce((value) => {
            setSearchCustomerText(value);
          }, 300)}
          showSearch={true}
          onChange={(value) => {
            setValue('customerId', value, { shouldValidate: true });
          }}
          wrapClassName="mt-3"
          className="h-[44px]"
          placeholder="Thêm khách vào đơn F4"
          suffixIcon={
            <Image
              src={PlusIcon}
              onClick={(e) => {
                setIsOpenAddCustomerModal(true);
                e.stopPropagation();
              }}
              alt=""
            />
          }
          prefixIcon={<Image src={CustomerIcon} alt="" />}
        />
        <InputError error={errors.customerId?.message} />

        <CustomCheckbox
          className="mt-3"
          onChange={(e) => {
            if (e.target.checked) {
              setIsOpenPrescriptionModal(true);
            } else {
              setValue('prescriptionId', undefined, { shouldValidate: true });
            }
          }}
          checked={!!getValues('prescriptionId')}
        >
          Bán thuốc theo đơn
        </CustomCheckbox>
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-3 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Tổng tiền (
                <span className="text-lg">
                  {orderObject[orderActive]?.length ?? 0} sp
                </span>
                )
              </div>
              <div className="text-lg leading-normal text-[#19191C]">
                {formatMoney(totalPrice)}
              </div>
            </div>

            <div className="mb-3 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Chiết khấu
              </div>
              <div className="w-[120px] ">
                <CustomInput
                  bordered={false}
                  className="h-6 pr-0 text-end text-lg"
                  onClick={() => {
                    setIsOpenAddDiscountModal(true);
                  }}
                  blurAfterClick={true}
                  forceValue={discount}
                  onChange={() => {
                    // nothing
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 flex justify-between">
              <div className="text-lg leading-normal text-[#000] ">
                KHÁCH PHẢI TRẢ
              </div>
              <div className="text-lg leading-normal text-red-main">
                {formatMoney(customerMustPay)}
              </div>
            </div>

            <div className="mb-3 ">
              <div className="flex justify-between">
                <div className="text-lg leading-normal text-[#828487]">
                  Tiền khách đưa
                </div>
                <div className="w-[120px]">
                  <CustomInput
                    bordered={false}
                    className="h-6 pr-0 text-end text-lg"
                    onChange={(value) => {
                      setValue('cashOfCustomer', value, {
                        shouldValidate: true,
                      });
                    }}
                    type="number"
                    hideArrow={true}
                    value={getValues('cashOfCustomer')}
                  />
                </div>
              </div>

              <InputError error={errors.cashOfCustomer?.message} />
            </div>

            <div className="mb-5 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Tiền thừa trả khách
              </div>
              <div className="text-lg leading-normal text-[#19191C]">
                {formatMoney(returnPrice)}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-5 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Phương thức thanh toán
              </div>
              <div className="text-lg leading-normal text-[#19191C]">
                {getValues('paymentType') === EPaymentMethod.CASH ? "Tiền mặt" : getValues('paymentType') === EPaymentMethod.BANKING ? "Chuyển khoản" : "Khách nợ"}
              </div>
            </div>

            <div className="flex justify-between">
              <div
                className={cx(' rounded-[18px] w-[96px] h-[99px]', {
                  'border-2 border-red-main':
                    getValues('paymentType') === EPaymentMethod.CASH,
                })}
              >
                <Image
                  src={Cash}
                  onClick={() =>
                    setValue('paymentType', EPaymentMethod.CASH, {
                      shouldValidate: true,
                    })
                  }
                  className=" cursor-pointer"
                  alt=""
                />
              </div>

              <div
                className={cx(' rounded-[18px] w-[96px] h-[99px]', {
                  'border-2 border-red-main':
                    getValues('paymentType') === EPaymentMethod.BANKING,
                })}
              >
                <Image
                  src={Bank}
                  onClick={() =>
                    setValue('paymentType', EPaymentMethod.BANKING, {
                      shouldValidate: true,
                    })
                  }
                  className=" cursor-pointer"
                  alt=""
                />
              </div>

              <div
                className={cx(' rounded-[18px] w-[96px] h-[99px]', {
                  'border-2 border-red-main':
                    getValues('paymentType') === EPaymentMethod.DEBT,
                })}
              >
                <Image
                  src={Debt}
                  onClick={() =>
                    setValue('paymentType', EPaymentMethod.DEBT, {
                      shouldValidate: true,
                    })
                  }
                  className=" cursor-pointer"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            onChange={(value) =>
              setValue('description', value, { shouldValidate: true })
            }
            value={getValues('description')}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="px-6 pb-6">
        <div className="mb-4 text-center text-red-main">
          Liên thông dược quốc gia
        </div>

        <CustomButton
          onClick={() => {
            const products: ISaleProductLocal[] = orderObject[orderActive];

            const formatProducts = products.map((product) => ({
              productId: product.productId,
              productUnitId: product.productUnitId,
              originProductUnitId: product.originProductUnitId,
              productType: product.product.type,
              quantity: product.quantity,
              isBatchExpireControl: product.product.isBatchExpireControl,
              batches: product.batches
                .filter((batch) => batch.isSelected)
                .map((batch) => ({
                  id: batch.batchId,
                  quantity: batch.quantity,
                  inventory: batch.inventory,
                })),
            }));

            setValue('products', formatProducts, { shouldValidate: true });
            setValue('totalPrice', customerMustPay, { shouldValidate: true });

            handleSubmit(onSubmit)();
          }}
          className="!h-11"
          disabled={isLoadingCreateOrder || !orderObject[orderActive]?.length}
          type={!orderObject[orderActive]?.length ? 'disable' : 'danger'}
        >
          <Image src={DolarIcon} alt="" /> Thanh toán
        </CustomButton>
      </div>

      <CreatePrescriptionModal
        isOpen={isOpenPrescriptionModal}
        onCancel={() => setIsOpenPrescriptionModal(false)}
        setOrderValue={setValue}
      />

      <CreateCustomerModal
        isOpen={isOpenAddCustomerModal}
        onCancel={() => setIsOpenAddCustomerModal(false)}
      />

      <CreateDiscountModal
        isOpen={isOpenAddDiscountModal}
        onCancel={() => setIsOpenAddDiscountModal(false)}
        setValue={setValue}
        getValues={getValues}
      />

      <ScanQrModal
        isOpen={isOpenScanQrModal}
        onCancel={() => {
          setIsOpenScanQrModal(false);
          setIsOpenOrderSuccessModal(true);
        }}
      />

      <OrderSuccessModal
        isOpen={isOpenOrderSuccessModal}
        onCancel={() => {
          setIsOpenOrderSuccessModal(false);
        }}
        saleInvoice={saleInvoice}
      />
    </RightContentStyled>
  );
}
