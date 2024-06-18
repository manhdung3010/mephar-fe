import { convertMoneyToString, formatDateTime, formatMoney, formatNumber, to_vietnamese } from '@/helpers'
import Image from 'next/image'
import React, { useMemo } from 'react'
import Logo from '@/public/apple-touch-icon.png';

function InvoicePrint({ record }: any) {
  const totalPrice = useMemo(() => {
    return record?.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);
  }, [record?.items])
  const totalReturnPrice = useMemo(() => {
    return record?.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price - item.discount;
    }, 0);
  }, [record?.items])
  return (
    <div >
      <div className='flex items-center flex-col'>
        <Image src={Logo} alt="logo" />
        <p className='font-bold mt-2'>{record?.branch?.name}</p>
        <h4 className='text-lg font-bold'>HÓA ĐƠN TRẢ HÀNG</h4>
        <p className='font-bold'>Số HĐ: <span>{record?.code}</span></p>
        <p>Ngày tạo: <span>{formatDateTime(record?.createdAt)}</span></p>
      </div>
      <div className='mt-5'>
        <p>Khách hàng: <span className='ml-1'>{record?.customer?.fullName}</span></p>
      </div>

      <div className="overflow-x-auto my-4">
        <table className="table-auto w-full">
          <thead className="text-left">
            <tr>
              <th className="border-black border-y-[1px] py-2">Tên sản phẩm</th>
              <th className="border-black border-y-[1px] py-2">Số lượng</th>
              <th className="border-black border-y-[1px] py-2">Đơn giá</th>
              <th className="border-black border-y-[1px] py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {record?.items.map((product, index) => (
              <tr key={index}>
                <td className="border-b-[1px] border-black border-dotted py-2">{product?.productUnit?.product?.name}</td>
                <td className="border-b-[1px] border-black border-dotted py-2">{formatNumber(product.quantity)}</td>
                <td className="border-b-[1px] border-black border-dotted py-2">{formatMoney(product.price)}</td>
                <td className="border-b-[1px] border-black border-dotted py-2">{formatMoney(product.quantity * product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số mặt hàng:</div>
          <div className="text-black-main">{record?.items?.length}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng tiền hàng trả:</div>
          <div className="text-black-main">{formatMoney(totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá phiếu trả:</div>
          <div className="text-black-main">{formatMoney(record?.discount)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Phí trả hàng:</div>
          <div className="text-black-main">{formatMoney(record?.returnFee)}</div>
        </div>
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Cần trả khách:</div>
          <div className="text-black-main">{formatMoney(totalReturnPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Đã trả khách:</div>
          <div className="text-black-main">{formatMoney(record?.paid)}</div>
        </div>
      </div>
      <div className='text-center'>
        <p className='italic mt-4'>
          (Bằng chữ: <span className=''>{to_vietnamese(+record?.paid)} đồng)</span>
        </p>
        <p className='italic mt-10'>Cảm ơn và hẹn gặp lại!</p>
      </div>

    </div>
  )
}

export default InvoicePrint