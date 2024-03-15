import Image from 'next/image';

import CloseCircleGrayIcon from '@/assets/closeCircleGrayIcon.svg';
import BoyImg from '@/assets/images/boy 1.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';

const DeleteProductModal = ({
  isOpen,
  onCancel,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}) => {
  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      customFooter
      width={420}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Xóa sản phẩm</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <Image src={BoyImg} alt="" />
        <div className="flex text-lg">
          Bạn có chắc chắn muốn xóa sản phẩm này?
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={onCancel}
          >
            Hủy
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 w-full"
            onClick={onSubmit}
          >
            Xóa
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteProductModal;
