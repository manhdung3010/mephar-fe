import CustomTable from '@/components/CustomTable'
import { formatDateTime, formatMoney, formatNumber } from '@/helpers'
import React from 'react'

function InvoicePrint({ data, columns, totalQuantity }: any) {
  return (
    <div className=''>
      <div className='flex items-center flex-col'>
        <h4 className='text-lg font-bold'>PHIẾU KIỂM KHO</h4>
        <p className='font-medium'>Mã phiếu: <span>{data?.code}</span></p>
      </div>
      <div className='mt-5 grid grid-cols-2'>
        <p>Chi nhánh kiểm: <span className='ml-1'>{data?.branchId}</span></p>
        <p>Trạng thái: <span className='ml-1'>Đã cân bằng kho</span></p>
        <p>Người tạo: <span className='ml-1'>{data?.userCreate?.fullName}</span></p>
        <p>Ngày tạo: <span>{formatDateTime(data?.createdAt)}</span></p>
        <p>Người cân bằng: <span className='ml-1'>{data?.userCreate?.fullName}</span></p>
        <p>Ngày cân bằng: <span>{formatDateTime(data?.createdAt)}</span></p>
      </div>

      <div>
        <CustomTable
          dataSource={data?.inventoryCheckingProduct?.map((item, index) => ({
            ...item,
            key: index + 1,
          }))}
          columns={columns}
          className="my-4"
          scroll={{ x: 0 }}
          bordered={true}
        />
      </div>

      <p>
        <span className='font-bold mb-5'>Ghi chú:</span> {data?.note}
      </p>

      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng thực tế {"(" + data?.totalRealQuantity + ")"}:</div>
          <div className="text-black-main">{formatMoney(data?.totalVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch tăng {"(" + formatNumber(data?.totalIncrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(data?.increaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch giảm {"(" + formatNumber(data?.totalDecrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(data?.decreaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng chênh lệch {"(" + formatNumber(data?.totalIncrease + data?.totalDecrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(data?.increaseVal + data?.decreaseVal)}</div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePrint