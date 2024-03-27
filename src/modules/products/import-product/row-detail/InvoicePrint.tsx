import CustomTable from '@/components/CustomTable'
import { formatDateTime, formatMoney, formatNumber } from '@/helpers'
import React from 'react'

function InvoicePrint({ data, columns, totalQuantity }: any) {
  return (
    <div >
      <div className='flex items-center flex-col'>
        <h4 className='text-lg font-bold'>PHIẾU NHẬP HÀNG</h4>
        <p className='font-bold'>Mã phiếu: <span>{data?.inbound?.code}</span></p>
        <p>Ngày tạo: <span>{formatDateTime(data?.inbound?.createdAt)}</span></p>
      </div>
      <div className='mt-5'>
        <p>Chi nhánh nhập: <span className='ml-1'>{data?.inbound?.branch?.name}</span></p>
        <p>Người tạo: <span className='ml-1'>{data?.inbound?.creator?.fullName}</span></p>
        <p>Nhà cung cấp: <span className='ml-1'>{data?.inbound?.supplier?.name}</span></p>
        <p>Địa chỉ: <span className='ml-1'>{data?.inbound?.supplier?.address}</span></p>
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

      <div className='flex flex-col w-80 ml-auto'>
        <p className='flex justify-between'>Tổng số lượng: <span className='ml-1'>{formatNumber(totalQuantity)}</span></p>
        <p className='flex justify-between'>Tổng số lượng mặt hàng: <span className='ml-1'>{data?.products?.length}</span></p>
        <p className='flex justify-between'>Tổng tiền: <span className='ml-1'>{formatMoney(data?.inbound?.totalPrice)}</span></p>
        <p className='flex justify-between'>Giảm giá: <span className='ml-1'>{formatMoney(data?.inbound?.discount)}</span></p>
        <p className='flex justify-between'>Tiền đã trả NCC: <span className='ml-1'>{formatMoney(data?.inbound?.paid)}</span></p>
        <p className='flex justify-between'>Nợ: <span className='ml-1'>{formatMoney(data?.inbound?.debt)}</span></p>

      </div>
      <p>
        <span className='font-bold'>Ghi chú:</span> {data?.inbound?.description}
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