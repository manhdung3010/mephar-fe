import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getCustomer } from '@/api/customer.service';
import { getEmployee } from '@/api/employee.service';
import { createOrderReturn } from '@/api/order.service';
import CustomerIcon from '@/assets/customerIcon.svg';
import DolarIcon from '@/assets/dolarIcon.svg';
import EditIcon from '@/assets/editIcon.svg';
import EmployeeIcon from '@/assets/employeeIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import {
  EDiscountType,
  EPaymentMethod
} from '@/enums';
import { formatMoney } from '@/helpers';
import {
  branchState,
  orderActiveState,
  orderState,
  profileState,
} from '@/recoil/state';
import cx from 'classnames';

import { CreateCustomerModal } from './CreateCustomerModal';
import { CreateDiscountModal } from './CreateDiscountModal';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { ScanQrModal } from './ScanQrModal';
import type { ISaleProductLocal } from './interface';
import { RightContentStyled } from './styled';
import Bank from '@/assets/images/bank.png';
import Cash from '@/assets/images/cash.png';
import Debt from '@/assets/images/debt.png';

export function RightContentReturn({ useForm, customerId, orderDetail }: { useForm: any, customerId: string, orderDetail: any }) {
  const queryClient = useQueryClient();

  const { getValuesReturn, setValueReturn, handleSubmitReturn, errorsReturn, resetReturn } = useForm;

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
    () => getCustomer({ page: 1, limit: 99, keyword: searchCustomerText })
  );

  useEffect(() => {
    if (profile) {
      setValueReturn('userId', profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (customerId) {
      setValueReturn('customerId', customerId, { shouldValidate: true });
    }
  }, [customerId])

  useEffect(() => {
    const orderKeys = Object.keys(orderObject);

    if (!orderActive || !orderKeys.includes(orderActive)) {
      setOrderActive(`${orderKeys[0]}`);
    }
  }, [orderActive]);

  const totalPrice = useMemo(() => {
    let price = 0;

    //caculate total price
    orderObject[orderActive]?.forEach((product: any) => {
      const unit = product.productUnit;
      price += Number(unit?.price ?? 0) * product.quantity;
    });

    return price;
  }, [orderObject, orderActive]);
  const totalReturnPrice = useMemo(() => {
    let price = 0;

    //caculate total return price
    orderObject[orderActive]?.forEach((product: any) => {
      const unit = product.productUnit;
      price += Number(unit?.returnPrice ?? 0) * product.quantity;
    });

    return price;
  }, [orderObject, orderActive]);

  const totalMustPay = useMemo(() => {
    let price = 0;

    //caculate total return price
    orderObject[orderActive]?.forEach((product: any) => {
      const unit = product.productUnit;
      price += Number(unit?.returnPrice ?? 0) * product.quantity;
    });

    price = price - (getValuesReturn('discount') ?? 0) - (getValuesReturn('returnFee') ?? 0);

    return price;
  }, [orderObject, orderActive, getValuesReturn('discount'), getValuesReturn('returnFee')]);

  // useEffect(() => {
  //   // get discount from customer when customer change
  //   if (getValuesReturn('customerId')) {
  //     const customer = customers?.data?.items?.find(
  //       (item) => item.id === getValuesReturn('customerId')
  //     );

  //     if (customer && customer?.groupCustomer?.discount) {
  //       setValueReturn('discount', customer?.groupCustomer.discount ?? 0, { shouldValidate: true });
  //       setValueReturn('discountType', EDiscountType.PERCENT, { shouldValidate: true });
  //     }
  //     else {
  //       setValueReturn('discount', 0, { shouldValidate: true });
  //       setValueReturn('discountType', EDiscountType.PERCENT, { shouldValidate: true });

  //     }
  //   }
  // }, [getValuesReturn('customerId')])

  const customerMustPay = useMemo(() => {
    if (getValuesReturn('discount')) {
      if (getValuesReturn('discountType') === EDiscountType.MONEY) {
        return totalPrice > Number(getValuesReturn('discount'))
          ? Math.round(totalPrice - Number(getValuesReturn('discount')))
          : 0;
      }

      if (getValuesReturn('discountType') === EDiscountType.PERCENT) {
        const discountValue =
          (totalPrice * Number(getValuesReturn('discount'))) / 100;
        return totalPrice > discountValue ? Math.round(totalPrice - discountValue) : 0;
      }
    }

    return totalPrice;
  }, [totalPrice, getValuesReturn('discount'), getValuesReturn('discountType')]);

  const returnPrice = useMemo(() => {
    if (getValuesReturn('cashOfCustomer')) {
      return Number(getValuesReturn('cashOfCustomer')) - customerMustPay;
    }

    return 0;
  }, [customerMustPay, getValuesReturn('cashOfCustomer')]);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } =
    useMutation(
      () => {
        const formatProducts = getValuesReturn('products')?.map(
          ({ isBatchExpireControl, ...product }) => ({
            ...product,
            batches: product.batches?.map((batch) => ({
              id: batch.id,
              quantity: batch.quantity,
            })),
          })
        );

        return createOrderReturn({
          ...getValuesReturn(),
          ...(getValuesReturn('customerId') === -1 && { customerId: null }),
          products: formatProducts,
          orderId: orderDetail?.order?.id,
          branchId,
        });
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(['LIST_SALE_PRODUCT']);
          if (res.data?.saleReturn) {
            setSaleInvoice(res.data?.saleReturn);
          }
          const orderClone = cloneDeep(orderObject);
          orderClone[orderActive] = [];
          setOrderObject(orderClone);
          // delete tab order object return
          const orderKeys = Object.keys(orderObject);
          const newOrderObject = { ...orderObject };
          delete newOrderObject[orderActive];
          setOrderObject(newOrderObject);
          setOrderActive(String(orderKeys[0]));

          setIsOpenOrderSuccessModal(true);
          resetReturn();
          setValueReturn('userId', profile.id, { shouldValidate: true });
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
          value={getValuesReturn('userId')}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            setValueReturn('userId', value, { shouldValidate: true });
          }}
          wrapClassName=""
          className="h-[44px]"
          placeholder="Chọn nhân viên bán hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errorsReturn.userId?.message} />

        <CustomSelect
          options={[
            ...(customers?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName + " - " + item.phone,
            })) || [])
          ]}
          value={getValuesReturn('customerId')}
          onSearch={debounce((value) => {
            setSearchCustomerText(value);
          }, 300)}
          showSearch={true}
          onChange={(value) => {
            setValueReturn('customerId', value, { shouldValidate: true });
          }}
          wrapClassName="mt-3"
          className="h-[44px]"
          placeholder="Thêm khách vào đơn F4"
          disabled
          prefixIcon={<Image src={CustomerIcon} alt="" />}
        />
        <InputError error={errorsReturn.customerId?.message} />
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>
      <div className="flex grow flex-col px-6">
        <div className='text-[#3E7BFA] text-xl mb-5'>Trả hàng</div>
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-3 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Tổng giá gốc hàng mua (
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
                Tổng tiền hàng trả (
                <span className="text-lg">
                  {orderObject[orderActive]?.length ?? 0} sp
                </span>
                )
              </div>
              <div className="text-lg leading-normal text-[#19191C]">
                {formatMoney(totalReturnPrice)}
              </div>
            </div>

            <div className="mb-3 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Giảm giá
              </div>
              <div className="w-[120px] ">
                <CustomInput
                  bordered={false}
                  className="h-6 pr-0 text-end text-lg"
                  value={getValuesReturn('discount') ?? 0}
                  type='number'
                  onChange={(value) => {
                    // nothing
                    setValueReturn('discount', value, { shouldValidate: true });
                  }}
                />
              </div>
            </div>
            <div className="mb-3 flex justify-between">
              <div className="text-lg leading-normal text-[#828487]">
                Phí trả hàng
              </div>
              <div className="w-[120px] ">
                <CustomInput
                  bordered={false}
                  className="h-6 pr-0 text-end text-lg"
                  value={getValuesReturn('returnFee') ?? 0}
                  type='number'
                  onChange={(value) => {
                    // nothing
                    setValueReturn('returnFee', value, { shouldValidate: true });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 flex justify-between">
              <div className="text-lg leading-normal text-[#000] ">
                CẦN TRẢ KHÁCH
              </div>
              <div className="text-lg leading-normal text-red-main">
                {formatMoney(totalMustPay)}
              </div>
            </div>
            <div className="flex flex-col mb-5">
              <div className='flex justify-between'>
                <div className="text-lg leading-normal text-[#828487]">
                  Tiền trả khách <span className='text-red-500'>*</span>
                </div>
                <div className="w-[120px]">
                  <CustomInput
                    bordered={false}
                    className="h-6 pr-0 text-end text-lg"
                    onChange={(value) => {
                      setValueReturn('paid', value, {
                        shouldValidate: true,
                      });
                    }}
                    type="number"
                    hideArrow={true}
                    value={getValuesReturn('paid')}
                  />
                </div>
              </div>
              <div className='text-right'>
                <InputError error={errorsReturn.paid?.message} />
              </div>
            </div>
            <div className="mb-5">
              <div className="mb-5 flex justify-between">
                <div className="text-lg leading-normal text-[#828487]">
                  Phương thức thanh toán
                </div>
                <div className="text-lg leading-normal text-[#19191C]">
                  {getValuesReturn('paymentType') === EPaymentMethod.CASH ? "Tiền mặt" : getValuesReturn('paymentType') === EPaymentMethod.BANKING ? "Chuyển khoản" : "Khách nợ"}
                </div>
              </div>

              <div className="flex justify-between">
                <div
                  className={cx(' rounded-[18px] w-[96px] h-[99px]', {
                    'border-2 border-red-main':
                      getValuesReturn('paymentType') === EPaymentMethod.CASH,
                  })}
                >
                  <Image
                    src={Cash}
                    onClick={() =>
                      setValueReturn('paymentType', EPaymentMethod.CASH, {
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
                      getValuesReturn('paymentType') === EPaymentMethod.BANKING,
                  })}
                >
                  <Image
                    src={Bank}
                    onClick={() =>
                      setValueReturn('paymentType', EPaymentMethod.BANKING, {
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
                      getValuesReturn('paymentType') === EPaymentMethod.DEBT,
                  })}
                >
                  <Image
                    src={Debt}
                    onClick={() =>
                      setValueReturn('paymentType', EPaymentMethod.DEBT, {
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
        </div>

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            onChange={(value) =>
              setValueReturn('description', value, { shouldValidate: true })
            }
            value={getValuesReturn('description')}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="px-6 pb-6">
        <CustomButton
          onClick={() => {
            const products: ISaleProductLocal[] = orderObject[orderActive];
            const formatProducts = products.map((product) => ({
              productId: product.productId,
              productUnitId: product.productUnitId,
              quantity: product.quantity,
              price: product.productUnit.returnPrice,
              batches: product.batches
                .filter((batch) => batch.isSelected)
                .map((batch: any) => ({
                  id: batch.batch.id,
                  quantity: product.quantity,
                })),
            }));

            setValueReturn('products', formatProducts, { shouldValidate: true });

            handleSubmitReturn(onSubmit)();
          }}
          className="!h-11"
          disabled={isLoadingCreateOrder || !orderObject[orderActive]?.length}
          type={!orderObject[orderActive]?.length ? 'disable' : 'danger'}
          loading={isLoadingCreateOrder}
        >
          <Image src={DolarIcon} alt="" /> Trả hàng
        </CustomButton>
      </div>

      <CreateDiscountModal
        isOpen={isOpenAddDiscountModal}
        onCancel={() => setIsOpenAddDiscountModal(false)}
        setValue={setValueReturn}
        getValues={getValuesReturn}
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
