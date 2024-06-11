import { CustomButton } from '@/components/CustomButton'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomInput } from '@/components/CustomInput'
import { CustomModal } from '@/components/CustomModal'
import { CustomRadio } from '@/components/CustomRadio'
import React from 'react'

function PointModal({ isOpen, onCancel }) {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thiết lập tích điểm"
      width={730}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div>
        <div>
          <CustomRadio
            options={[
              { value: 1, label: "Hóa đơn" },
              { value: 2, label: "Hàng hóa" },
            ]}
            onChange={(value) => {
              // setValue("type", value, { shouldValidate: true })
            }}
          // value={getValues("type")}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-3'>
        <div className='grid grid-cols-5'>
          <div className='col-span-2'>
            Tỉ lệ quy đổi điểm thưởng
          </div>
          <div className='flex items-center gap-2 col-span-3'>
            <CustomInput onChange={(value) => { }} />
            <span>VNĐ</span>
            = 1 điểm thưởng
          </div>
        </div>
        <div className='grid grid-cols-5 items-center'>
          <div className='col-span-2'>
            <CustomCheckbox /> Cho phép thanh toán bằng điểm
          </div>
          <div className='flex items-center gap-2 col-span-3'>
            <CustomInput onChange={(value) => { }} />
            <span className='flex-shrink-0'>điểm =</span> <CustomInput onChange={(value) => { }} /> VNĐ
          </div>
        </div>
        <div className='grid grid-cols-5 items-center'>
          <div className='col-span-2'>
            Cho phép thanh toán bằng điểm
          </div>
          <div className='flex items-center gap-2 col-span-3'>
            <CustomInput onChange={(value) => { }} /> lần mua
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={onCancel}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  )
}

export default PointModal