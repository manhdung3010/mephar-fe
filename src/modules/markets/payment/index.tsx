import React, { useMemo, useState } from 'react';
import MarkIcon from '@/assets/markRedIcon.svg';
import ArrowIcon from '@/assets/arrow-right-red.svg';
import Image from 'next/image';
import StoreIcon from '@/assets/storeIcon.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { branchState, paymentProductState, profileState } from '@/recoil/state';
import { formatMoney, formatNumber, getImage, sliceString } from '@/helpers';
import { CustomInput } from '@/components/CustomInput';
import StickyNoteIcon from '@/assets/stickynote.svg';
import { CustomButton } from '@/components/CustomButton';
import AddressModal from './AddressModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMarketOrder, getShipAddress } from '@/api/market.service';
import { message } from 'antd';
import OrderModal from './OrderModal';

export const shipFee = 50000;

function Payment() {
  const [paymentProduct, setPaymentProduct] = useRecoilState<any>(paymentProductState);
  const [openAddress, setOpenAddress] = useState(false);
  const [openOrderSuccess, setOpenOrderSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const profile = useRecoilValue(profileState);
  const branchId = useRecoilValue(branchState);
  const [paymentNote, setPaymentNote] = useState<string>('');

  const { data: address } = useQuery(
    ['SHIP_ADDRESS', JSON.stringify({ page: 1, limit: 10, isDefaultAddress: 1, branchId })],
    () => getShipAddress({ page: 1, limit: 10, isDefaultAddress: 1 }),
    {
      onSuccess: (data) => {
        if (data?.data?.items) {
          setSelectedAddress(data?.data?.items[0]);
        }
      }
    }
  );

  // Calculate total cost for all stores
  const totalMoney = useMemo(() => {
    return paymentProduct.reduce((total, store) => {
      const storeTotal = store.products.reduce((storeSum, product) => {
        return storeSum + (product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price) * product?.quantity;
      }, 0);
      return total + storeTotal;
    }, 0);
  }, [paymentProduct]);

  const calculateDeliveryDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const deliveryDate = calculateDeliveryDate(3);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } = useMutation(
    () => {
      const payload = {
        orders: paymentProduct.map((store) => ({
          addressId: selectedAddress?.id,
          listProduct: store.products.map((product) => ({
            marketProductId: product?.marketProductId,
            quantity: product?.quantity,
            price: product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price,
          })),
          note: paymentNote,
          toStoreId: store?.products[0]?.marketProduct?.storeId,
        })),
      }
      return createMarketOrder(payload);
    },
    {
      onSuccess: (data) => {
        setOrderInfo(data?.data?.item);
        setOpenOrderSuccess(true);
        setPaymentNote('');
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
    <div className='bg-[#fafafc] text-[#28293D]'>
      <div className='fluid-container'>
        {/* Breadcrumb */}
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span>Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li className='!text-red-main'>
              <span>Giỏ hàng</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Thanh toán</a>
            </li>
          </ul>
        </nav>

        {/* Address Section */}
        <div className='bg-white my-4 p-6 border-t-4 border-[#FF3B3B] flex gap-2 items-center'>
          <div className='w-3/4'>
            <div className='flex items-center gap-1 text-red-main'>
              <Image src={MarkIcon} />
              <span>Địa chỉ nhận hàng</span>
            </div>
            {selectedAddress && (
              <div className='mt-1 ml-7 text-[#28293D]'>
                <p>{profile?.fullName} | {selectedAddress?.phone}</p>
                <p>{selectedAddress?.address}, {selectedAddress?.ward?.name}, {selectedAddress?.district?.name}, {selectedAddress?.province?.name}</p>
              </div>
            )}
          </div>
          <div className='w-1/4 flex justify-end'>
            <Image src={ArrowIcon} className='cursor-pointer' onClick={() => setOpenAddress(true)} />
          </div>
        </div>

        {/* Product Section */}
        {paymentProduct.map((store) => (
          <div key={store.branchId}>
            {/* Store Name */}
            <div className='flex items-center gap-1 p-6 bg-white round border-b-[1px] border-[#E4E4EB] mt-4 text-[#333333] font-semibold'>
              <Image src={StoreIcon} />
              {store.products[0]?.marketProduct?.store?.name}
            </div>

            {/* Products */}
            {store.products.map((product) => (
              <div className='p-[14px] grid grid-cols-10 text-center items-center' key={product?.id}>
                <div className='col-span-4 flex items-center gap-5'>
                  <div className='flex-shrink-0 h-20 w-20'>
                    <Image src={getImage(product?.marketProduct?.imageCenter?.path || product?.imageCenter?.path)} width={80} height={80} className='object-cover rounded-lg border-[1px] border-[#E4E4EB]' />
                  </div>
                  <span className='text-base font-medium line-clamp-1'>{product?.marketProduct?.product?.name}</span>
                </div>
                <div className='col-span-2 flex items-center justify-center gap-1'>
                  {product?.marketProduct?.discountPrice > 0 && (
                    <span className='text-[#999999] line-through'>{formatMoney(product?.price)}</span>
                  )}
                  <span className='text-base text-[#28293D] font-medium'>{formatMoney(product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price)}</span>
                </div>
                <div className='col-span-2'>
                  {"x" + formatNumber(product?.quantity)}
                </div>
                <div className='col-span-2 text-red-main text-base font-medium'>
                  {formatMoney((product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price) * product?.quantity)}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Shipping and Total */}
        <div className='bg-white'>
          <div className='py-3 px-4 bg-[#E5FFFF]'>
            <div className='pb-3 border-b-[1px] border-[#00CFDE] text-base text-[#00B7C4] font-semibold'>
              Phương thức vận chuyển
            </div>
            <div className='pt-3 flex items-center'>
              <div className='w-3/4 flex flex-col'>
                <span className='font-semibold'>Nhanh</span>
                <span className='text-[#8F90A6]'>Nhận hàng vào {deliveryDate}</span>
              </div>
              <div className='flex items-center w-1/4 justify-end'>
                {formatMoney(shipFee)}
                <Image src={ArrowIcon} />
              </div>
            </div>
          </div>

          <div className='px-4 flex justify-between pt-2 pb-4 border-b-[1px] border-[#EBEBF0]'>
            <span className='text-base font-medium '>Tin nhắn</span>
            <CustomInput onChange={(value) => setPaymentNote(value)} placeholder='Lưu ý cho người bán' className='!border-0' />
          </div>

          {/* Total Amount for All Stores */}
          <div className='px-4 flex justify-between pt-4 pb-4'>
            <span className='text-base font-medium '>Tổng số tiền ({formatNumber(paymentProduct.reduce((total, store) => total + store.products.length, 0))} sp)</span>
            <span className='text-red-main text-base font-medium'>{formatMoney(totalMoney)}</span>
          </div>

          <div className='px-4'>
            <div className='py-2 border-t-[6px] border-b-[6px] border-[#ECECEC]'>
              <div className='flex items-center gap-1'>
                <Image src={StickyNoteIcon} />
                <span className='text-base font-medium '>Chi tiết thanh toán</span>
              </div>
              <div className='mt-[14px] flex flex-col gap-3'>
                <div className='flex justify-between items-center font-medium'>
                  <span>Tổng tiền hàng</span>
                  <span>{formatMoney(totalMoney)}</span>
                </div>
                <div className='flex justify-between items-center font-medium'>
                  <span>Tổng tiền phí vận chuyển</span>
                  <span>{formatMoney(shipFee)}</span>
                </div>
                <div className='flex justify-between items-center font-medium'>
                  <span className='text-base'>Tổng thanh toán</span>
                  <span className='text-red-main text-xl font-semibold'>{formatMoney(totalMoney + shipFee)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-end my-4'>
            <CustomButton className='!w-[300px] !h-[46px]' onClick={onSubmit} loading={isLoadingCreateOrder} disabled={isLoadingCreateOrder}>Đặt hàng</CustomButton>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={openAddress}
        onCancel={() => setOpenAddress(false)}
        onSave={(selectedAddress) => setSelectedAddress(selectedAddress)}
      />
      <OrderModal isOpen={openOrderSuccess} onCancel={() => setOpenOrderSuccess(false)} orderInfo={orderInfo} totalMoney={totalMoney + shipFee} />
    </div>
  );
}

export default Payment;
