import Image from 'next/image';

import CloseIcon from '@/assets/closeGrayIcon.svg';
import SampleProduct from '@/assets/images/product-sample.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';

export function SeriDetailModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  return (
    <CustomModal
      title="Chi tiết seri đã quét"
      isOpen={isOpen}
      onCancel={onCancel}
      width={900}
      customFooter={true}
    >
      <div className="">
        <div className="my-4 h-[1px] w-full border-b border-[#C7C9D9]"></div>
        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div className="mb-2 font-medium text-[#333]">Thuốc cảm cúm</div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black ">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>

          <div className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black">
            QR4993984 <Image src={CloseIcon} />
          </div>
        </div>
        <div className="my-4 h-[1px] w-full border-b border-[#C7C9D9]"></div>

        <CustomButton className="ml-auto !h-12 !w-[150px] p-3 text-xl">
          Xác nhận
        </CustomButton>
      </div>
    </CustomModal>
  );
}
