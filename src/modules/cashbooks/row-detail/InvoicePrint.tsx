import { convertMoneyToString, formatDateTime, formatMoney, formatNumber } from '@/helpers'
import Image from 'next/image'
import React from 'react'
import Logo from '@/public/apple-touch-icon.png';

function InvoicePrint({ saleInvoice }: any) {
  const getDiscount = (record) => {
    let total = 0;
    record.products?.forEach((item) => {
      total += item.price;
    });
    return formatMoney(total);
  }
  return (
    <div >
      <div>
        <p className='font-bold'>{saleInvoice?.branch?.name}</p>
        <p>
          SĐT: <span>{saleInvoice?.branch?.phone}</span>
        </p>
      </div>
      <div className='flex items-center flex-col'>
        <h4 className='text-lg font-bold'>PHIẾU {saleInvoice?.ballotType === 'income' ? 'THU' : 'CHI'}</h4>
        <p className='font-bold'>Mã phiếu: <span>{saleInvoice?.code}</span></p>
        <p>Ngày: <span>{formatDateTime(saleInvoice?.createdAt)}</span></p>
      </div>
      <div className='mt-5'>
        <p className='flex gap-3'>
          <span className='w-[180px] flex-shrink-0'>Họ tên người nhận:</span>
          <span className='ml-1'>{saleInvoice?.targetOther?.name || saleInvoice?.targetCustomer?.fullName || saleInvoice?.targetSupplier?.name}</span></p>
        <p className='flex gap-3'>
          <span className='w-[180px] flex-shrink-0'>SĐT: </span>
          <span className='ml-1'>{saleInvoice?.targetOther?.phone || saleInvoice?.targetCustomer?.phone || saleInvoice?.targetSupplier?.phone}</span></p>
        <p className='flex gap-3'>
          <span className='w-[180px] flex-shrink-0'>Lý do: </span>

          <span className='ml-1'>{saleInvoice?.note}</span></p>
        <p className='mt-5'>Số tiền: <span className='ml-1 font-semibold'>{formatMoney(saleInvoice?.value)}</span></p>
        <p>Bằng chữ: <span className='ml-1'>{convertMoneyToString(+saleInvoice?.value)} đồng</span></p>
      </div>

      <div className='mt-7 grid grid-cols-3'>
        <div></div>
        <div></div>
        <div>
          <div className=' flex gap-4'>
            <span>Ngày</span>
            <span>tháng</span>
            <span>năm</span>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3'>
        <span className='font-semibold'>
          Người lập phiếu
        </span>
        <span className='font-semibold'>
          Người lập phiếu
        </span>
        <span className='font-semibold'>
          Người lập phiếu
        </span>
      </div>

    </div>
  )
}

export default InvoicePrint