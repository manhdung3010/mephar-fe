import CustomTable from '@/components/CustomTable'
import { formatDateTime, formatMoney, formatNumber } from '@/helpers'
import React from 'react'

function InvoicePrint({ data, columns, totalQuantity }: any) {
  return (
    <div >
      <div className='flex items-center flex-col'>
        <h4 className='text-lg font-bold'>TRẢ HÀNG NHẬP</h4>
        <p className='font-bold'>Mã phiếu: <span>{data?.purchaseReturn?.code}</span></p>
        <p>Ngày tạo: <span>{formatDateTime(data?.purchaseReturn?.createdAt)}</span></p>
      </div>
      <div className='mt-5'>
        <p>Địa chỉ chi nhánh: <span className='ml-1'>{data?.purchaseReturn?.branch?.name}</span></p>
        <p>Người tạo: <span className='ml-1'>{data?.purchaseReturn?.creator?.fullName}</span></p>
        <p>Nhà cung cấp: <span className='ml-1'>{data?.purchaseReturn?.supplier?.name}</span></p>
        <p>Địa chỉ: <span className='ml-1'>{data?.purchaseReturn?.supplier?.address}</span></p>
      </div>

      <div>
        <CustomTable
          dataSource={data?.products?.map((item, index) => ({
            ...item,
            key: index + 1,
          }))}
          columns={columns}
          className="my-4"
          scroll={{ x: 0 }}
          bordered={true}
        />
      </div>

      <div className="ml-auto mb-5 w-[380px]">
        <div className="grid grid-cols-2">
          <div className="">Tổng số lượng:</div>
          <div className="text-black-main">{formatNumber(totalQuantity)}</div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Tổng số mặt hàng:</div>
          <div className="text-black-main">
            {data?.products?.length}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Tổng tiền hàng trả:</div>
          <div className="text-black-main">
            {formatMoney(data?.purchaseReturn?.totalPrice)}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Giảm giá:</div>
          <div className="text-black-main">
            {formatMoney(data?.purchaseReturn?.discount)}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Tiền NCC trả:</div>
          <div className="text-black-main">
            {formatMoney(data?.purchaseReturn?.paid)}
          </div>
        </div>
      </div>
      <p>
        <span className='font-bold'>Ghi chú:</span> {data?.purchaseReturn?.description}
      </p>
      <div className='flex justify-evenly mt-20'>
        <div className='text-center'>
          <p className='font-bold'>Nhà cung cấp</p>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>
        <div className='text-center'>
          <p className='font-bold'>Người lập</p>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  )
}

export default InvoicePrint