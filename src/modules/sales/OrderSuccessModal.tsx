import Image from 'next/image';

import CartIcon from '@/assets/cartIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';

export function OrderSuccessModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  return (
    <CustomModal width={480} isOpen={isOpen} onCancel={onCancel} footer={null}>
      <div className="flex flex-col justify-center py-4 text-center">
        <div className="mt-10 mb-9">
          <Image src={CartIcon} alt="" />
        </div>

        <div className="mb-10">
          <div className="text-xl font-medium text-[#039F00]">
            Thanh toán thành công!
          </div>
          <div className="text-xl font-medium text-[#28293D]">
            Bạn có muốn in hóa đơn không?
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <CustomButton
            onClick={onCancel}
            className="!h-11 "
            outline={true}
            wrapClassName="w-1/2"
          >
            Không
          </CustomButton>
          <CustomButton wrapClassName="w-1/2" className="!h-11">
            In hóa đơn
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
