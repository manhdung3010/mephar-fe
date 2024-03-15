import Image from 'next/image';

import UserImage from '@/assets/images/user.png';
import QuestionIcon from '@/assets/questionIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';

export function RemoveEmployeeModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Xóa người dùng"
      width={500}
      customFooter={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div>
        <div className="relative mb-6 flex justify-center">
          <Image src={UserImage} alt="" />

          <div className=" absolute top-0 right-[calc(50%-58px)]">
            <Image src={QuestionIcon} />
          </div>
        </div>
        <div className="mb-6 text-center text-lg">
          Bạn có chắc chắn muốn xóa người dùng chientbtest?
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CustomButton
            type="danger"
            outline={true}
            className="!h-11"
            onClick={onCancel}
          >
            Hủy
          </CustomButton>
          <CustomButton type="danger" className="!h-11">
            Xóa
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
