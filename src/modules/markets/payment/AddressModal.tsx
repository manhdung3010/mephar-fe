import { CustomButton } from '@/components/CustomButton'
import { CustomModal } from '@/components/CustomModal'
import { Radio } from 'antd'
import React from 'react'
import EditIcon from '@/assets/editIcon.svg'
import PlusIcon from '@/assets/plusIcon.svg'
import Image from 'next/image'
import AddAddressModal from './AddAddressModal'

function AddressModal({ isOpen, onCancel }) {
  const [openAddAddress, setOpenAddAddress] = React.useState(false);
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`Địa chỉ nhận hàng`}
      width={900}
      customFooter={true}
    >
      <div className='my-8'>
        <Radio.Group className='flex flex-col gap-6'>
          <div className='pb-6 border-b-[1px] border-[#EBEBF0] flex items-center'>
            <Radio value={1}></Radio>
            <div className='w-full flex justify-between items-center ml-2'>
              <div className='flex flex-col gap-1'>
                <p className='text-[#28293D] font-medium'>Nguyễn Văn A | 0123456789</p>
                <span className='text-[#555770]'>9, 89 Mễ Trì Thượng, Quận Nam Từ Liêm, Hà Nội</span>
                <p className='bg-[#fde5eb] text-red-main p-1 font-semibold w-fit rounded'>Địa chỉ mặc định</p>
              </div>
              <div>
                <Image src={EditIcon} className='cursor-pointer' />
              </div>
            </div>
          </div>

          <div className='pb-0 flex items-center'>
            <Radio value={2}></Radio>
            <div className='w-full flex justify-between items-center ml-2'>
              <div className='flex flex-col gap-1'>
                <p className='text-[#28293D] font-medium'>Nguyễn Văn A | 0123456789</p>
                <span className='text-[#555770]'>9, 89 Mễ Trì Thượng, Quận Nam Từ Liêm, Hà Nội</span>
                <p className='bg-[#fde5eb] text-red-main p-1 font-semibold w-fit rounded'>Địa chỉ mặc định</p>
              </div>
              <div>
                <Image src={EditIcon} className='cursor-pointer' />
              </div>
            </div>
          </div>

          <div className='w-fit'>
            <CustomButton type='original' outline onClick={() => setOpenAddAddress(true)}>Thêm địa chỉ mới</CustomButton>
          </div>
        </Radio.Group>
      </div>

      <div className="flex justify-end gap-2">
        <CustomButton outline type='original' className='!w-[180px] !h-11'>Hủy</CustomButton>
        <CustomButton className='!w-[180px] !h-11'>Xác nhận</CustomButton>
      </div>

      <AddAddressModal isOpen={openAddAddress} onCancel={() => setOpenAddAddress(false)} />
    </CustomModal>
  )
}

export default AddressModal