import { CustomButton } from '@/components/CustomButton'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomModal } from '@/components/CustomModal'
import { CustomRadio } from '@/components/CustomRadio'
import React from 'react'

function PointModal({ isOpen, onCancel }) {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thiết lập tích điểm"
      width={660}
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
      <div className='grid grid-cols-6'>
        <div className='col-span-2'>
          <div>
            Tỉ lệ quy đổi điểm thưởng
          </div>
          <div>
            <CustomCheckbox /> Cho phép thanh toán bằng điểm
          </div>
          <div>
            Thanh toán bằng điểm sau
          </div>
        </div>
        <div className='col-span-4'>

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