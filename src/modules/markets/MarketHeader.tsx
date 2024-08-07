import React from 'react'
import Logo from '@/assets/whiteLogo.svg'
import MenuMarket1 from '@/assets/menuMarket1.svg'
import MenuMarket2 from '@/assets/menuMarket2.svg'
import SearchIcon from '@/assets/searchIcon.svg'
import CartIcon from '@/assets/marketCartIcon.svg'
import NotificationIcon from '@/assets/notificationIcon.svg'
import Image from 'next/image'
import { CustomInput } from '@/components/CustomInput'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { profileState } from '@/recoil/state'

function MarketHeader() {
  const router = useRouter();
  const profile = useRecoilValue(profileState)
  console.log('profile', profile)
  return (
    <div className='bg-[#D64457]'>
      <div className='fluid-container grid grid-cols-12 gap-x-6 items-center py-5'>
        <div className='col-span-2 cursor-pointer' onClick={() => router.push('/markets')}>
          <Image src={Logo} alt='logo' />
        </div>
        <div className='col-span-6'>
          <CustomInput className='h-[54px] rounded-xl' prefixIcon={<Image src={SearchIcon} />} placeholder='Tìm kiếm sản phẩm' onChange={() => { }} />
        </div>
        <div className='col-span-4 flex items-center gap-10'>
          <div className='flex items-center  gap-6'>
            <div className='w-[54px] h-[54px] bg-[#FFE5E5] rounded-[18px] flex justify-center items-center cursor-pointer'>
              <Image src={MenuMarket1} />
            </div>
            <div className='w-[54px] h-[54px] bg-[#FFE5E5] rounded-[18px] flex justify-center items-center cursor-pointer' onClick={() => router.push('/markets/stores')}>
              <Image src={MenuMarket2} />
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <Image src={CartIcon} />
            <Image src={NotificationIcon} />
            <div className='flex items-center gap-2'>
              <div className='rounded-full w-6 h-6 overflow-hidden border-[1px] border-[#efb4bc] grid place-items-center'>
                <Image src={profile?.avatar?.pathName || Logo} />
              </div>
              <h4 className='font-medium text-white'>{profile?.fullName}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketHeader