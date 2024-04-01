import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CloseIcon from '@/assets/closeIcon.svg';
import DeliveryIcon from '@/assets/deliveryIcon.svg';
import DocumentIcon from '@/assets/documentBlueIcon.svg';
import DolarIcon from '@/assets/dolarBlueIcon.svg';
import ReportIcon from '@/assets/reportBlueIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { EOrderStatus, EOrderStatusLabel } from '@/enums';
import { formatMoney, formatNumber } from '@/helpers';


import { OrderHistoryModal } from './HistoryModal';
import { IOrder } from '../type';

export function Info({ record }: { record: IOrder }) {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = record.products.reduce((acc, product) => {
      return acc + product.price;
    }, 0);
    setTotalPrice(total);
  }, [record.products])

  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  return (
    <div className="gap-12 ">
      <div className="mb-4 grid grid-cols-2 border-b border-[#E8EAEB]">
        <div>
          <div className="mb-4 font-semibold text-black-main">
            Thông tin đơn hàng
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Mã đơn hàng:</div>
            <div className="col-span-2 text-black-main">{record.code}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Người mua:</div>
            <div className="col-span-2 text-black-main">
              {record.customer?.fullName}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Trạng thái:</div>
            <div
              className={cx(
                {
                  'text-[#FF8800] border border-[#FF8800] bg-[#fff]':
                    record.status === EOrderStatus.PENDING,
                  'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                    record.status === EOrderStatus.SUCCEED,
                  'text-[#0070F4] border border-[#0070F4] bg-[#E4F0FE]':
                    record.status === EOrderStatus.DELIVERING,
                  'text-[#EA2020] border border-[#EA2020] bg-[#FFE7E9]':
                    record.status === EOrderStatus.CANCELLED,
                },
                'px-2 py-1 rounded-2xl w-max'
              )}
            >
              {EOrderStatusLabel[record.status]}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Ghi chú:</div>
            <div className="col-span-2 text-black-main">{record?.description}</div>
          </div>
          {/* <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Lý do huỷ:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div> */}
        </div>

        {/* <div>
          <div className="mb-4 font-semibold text-black-main">
            Thông tin vận chuyển
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Đơn vị vận chuyển:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Mã vận chuyển:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Phí vận chuyển:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Dự kiến nhận hàng:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>

          <button
            className="cursor-pointer text-red-main underline"
            onClick={() => setOpenHistoryModal(true)}
          >
            Lịch sử đơn hàng
          </button>
        </div> */}
      </div>

      <div className="mb-4 grid grid-cols-2 border-b border-[#E8EAEB]">
        {/* <div>
          <div className="mb-4 font-semibold text-black-main">
            Thông tin NHẬN HÀNG
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tên người nhận:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Số điện thoại:</div>
            <div className="col-span-2 text-black-main">----</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Địa chỉ:</div>
            <div className="col-span-2 text-black-main">-----</div>
          </div>
        </div> */}

        <div>
          <div className="mb-4 font-semibold text-black-main">
            Thông tin Thanh toán
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tổng tiền sản phẩm:</div>
            <div className="col-span-2 text-black-main">
              {formatMoney(totalPrice)}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tổng tiền thanh toán:</div>
            <div className="col-span-2 text-black-main">
              {formatMoney(record.cashOfCustomer)}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="mb-4 text-base font-semibold text-black-main">
          sản phẩm ({record.products.length})
        </div>

        {record.products.map((product) => (
          <div
            key={product.productId}
            className="mb-5 flex items-center gap-x-3"
          >
            <div className="rounded border border-gray-500 p-1 w-[60px] h-[60px]">
              {product.product.image?.path && (
                <Image
                  width={60}
                  height={60}
                  src={product.product.image.path}
                  alt=""
                  objectFit="cover"
                />
              )}{' '}
            </div>
            <div className="text-black-main">
              <div className="font-semibold text-gray-main">
                {product.product?.shortName} – {product.product?.name}
              </div>
              <div className="font-semibold text-gray-main">
                {formatNumber(product.productUnit?.price)}vnđ/{' '}
                {product.productUnit?.unitName}
              </div>
              <div className="flex justify-between gap-x-40">
                <div>x{product.quantity}</div>
                <div className="text-[#00B63E]">
                  Tổng tiền: {formatMoney(product.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        {/* <CustomButton
          type="primary"
          outline={true}
          onClick={() => {
            router.push('/transactions/order/process-order');
          }}
          prefixIcon={<Image src={DocumentIcon} alt="" />}
        >
          Xử lý đơn hàng
        </CustomButton>

        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={ReportIcon} alt="" />}
        >
          Xác nhận
        </CustomButton>

        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={DeliveryIcon} alt="" />}
        >
          Gửi ĐVVC
        </CustomButton>

        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={DolarIcon} alt="" />}
        >
          Đã thanh toán
        </CustomButton> */}

        <CustomButton
          outline={true}
          prefixIcon={<Image src={CloseIcon} alt="" />}
        >
          Hủy bỏ
        </CustomButton>
      </div>

      <OrderHistoryModal
        isOpen={openHistoryModal}
        onCancel={() => setOpenHistoryModal(false)}
      />
    </div>
  );
}
