import { CustomButton } from '@/components/CustomButton'
import { CustomModal } from '@/components/CustomModal'
import { Radio } from 'antd'
import React from 'react'
import EditIcon from '@/assets/editIcon.svg'
import PlusIcon from '@/assets/plusIcon.svg'
import Image from 'next/image'
import AddAddressModal from './AddAddressModal'
import { useQuery } from '@tanstack/react-query'
import { getShipAddress } from '@/api/market.service'
import { useRecoilValue } from 'recoil'
import { branchState, profileState } from '@/recoil/state'

function AddressModal({ isOpen, onCancel, onSave }) {
  const [openAddAddress, setOpenAddAddress] = React.useState(false);
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [formFilter, setFormFilter] = React.useState({
    page: 1,
    limit: 10,
    branchId
  });
  const [selectedAddress, setSelectedAddress] = React.useState<any>(null);

  const { data: address, isLoading } = useQuery(
    ['SHIP_ADDRESS', JSON.stringify(formFilter)],
    () => getShipAddress(formFilter),
    {
      onSuccess: (data) => {
        if (data?.data?.items) {
          const defaultAddress = data?.data?.items?.find((item) => item?.isDefaultAddress);
          setSelectedAddress(defaultAddress?.id);
        }
      }
    }
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`Địa chỉ nhận hàng`}
      width={900}
      customFooter={true}
    >
      <div className='my-8'>
        <Radio.Group className='flex flex-col gap-6' value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
          {
            address?.data?.items?.map((item, index) => (
              <div className='pb-6 border-b-[1px] border-[#EBEBF0] flex items-center' key={item?.id}>
                <Radio value={item?.id}></Radio>
                <div className='w-full flex justify-between items-center ml-2'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-[#28293D] font-medium'>{profile?.fullName} | {item?.phone}</p>
                    <span className='text-[#555770]'>{item?.address}, {item?.ward?.name}, {item?.district?.name}, {item?.province?.name}</span>
                    {
                      item?.isDefaultAddress && (
                        <p className='bg-[#fde5eb] text-red-main p-1 font-semibold w-fit rounded'>Địa chỉ mặc định</p>
                      )
                    }
                  </div>
                  <div>
                    <Image src={EditIcon} className='cursor-pointer' onClick={() => {
                      setSelectedAddress(item);
                      setOpenAddAddress(true);
                    }} />
                  </div>
                </div>
              </div>
            ))
          }

          <div className='w-fit'>
            <CustomButton type='original' outline onClick={() => setOpenAddAddress(true)}>Thêm địa chỉ mới</CustomButton>
          </div>
        </Radio.Group>
      </div>

      <div className="flex justify-end gap-2">
        <CustomButton outline type='original' className='!w-[180px] !h-11' onClick={onCancel}>Hủy</CustomButton>
        <CustomButton className='!w-[180px] !h-11' onClick={() => {
          const newSelectedAddress = address?.data?.items?.find((item) => item?.id === selectedAddress);
          onSave(newSelectedAddress);
          onCancel();
        }}>Xác nhận</CustomButton>
      </div>

      <AddAddressModal isOpen={openAddAddress} onCancel={() => setOpenAddAddress(false)} addressId={selectedAddress?.id} />
    </CustomModal>
  )
}

export default AddressModal