import CustomTable from '@/components/CustomTable'
import { formatDateTime } from '@/helpers'

function DeliveryInvoice({ data, columns }: any) {
  return (
    <div >
      <div className='flex items-center flex-col'>
        <h4 className='text-lg font-bold'>PHIẾU CHUYỂN HÀNG</h4>
        <p className='font-bold'>Mã phiếu: <span>{data?.code}</span></p>
        <p>Ngày chuyển: <span>{formatDateTime(data?.movedAt)}</span></p>
      </div>
      <div className='mt-5'>
        <p>Chi nhánh chuyển: <span className='ml-1'>{data?.fromBranch?.name}</span></p>
        <p>Người chuyển: <span className='ml-1'>{data?.movedByUser?.fullName}</span></p>
        <p>Chi nhánh nhận: <span className='ml-1'>{data?.toBranch?.name}</span></p>
        <p>Người nhận: <span className='ml-1'>{data?.receivedByUser?.fullName}</span></p>
      </div>

      <div>
        <CustomTable
          dataSource={data?.items?.map((item, index) => ({
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
        <span className=''>Ghi chú chi nhánh chuyển:</span> {data?.note}
      </p>
      <p className=' pt-5'>
        <span>Ghi chú chi nhánh nhận:</span> {data?.receiveNote}
      </p>
      <div className='flex justify-evenly mt-20'>
        <div className='text-center'>
          <p className='font-bold'>Người chuyển</p>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>
        <div className='text-center'>
          <p className='font-bold'>Người nhận</p>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInvoice