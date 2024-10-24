import Image from "next/image";

import CloseCircleGrayIcon from "@/assets/closeCircleGrayIcon.svg";
import BoyImg from "@/assets/images/boy 1.png";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";

/**
 * DeleteModal component renders a modal dialog for confirming the deletion of an item.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {() => void} props.onCancel - Function to call when the cancel button is clicked.
 * @param {() => void} [props.onSuccess] - Optional function to call when the delete button is clicked.
 * @param {string} props.content - The content or name of the item to be deleted.
 * @param {boolean} [props.isLoading] - Optional flag indicating whether the delete action is in progress.
 *
 * @returns {JSX.Element} The rendered DeleteModal component.
 */
const DeleteModal = ({
  isOpen,
  onCancel,
  onSuccess,
  content,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  content: string;
  isLoading?: boolean;
}) => {
  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={500}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Xóa {content}</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <Image src={BoyImg} alt="" />
        <div className="flex text-center text-lg">Bạn có chắc chắn muốn xóa {content} này?</div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton outline={true} className="!h-11 w-full" onClick={onCancel}>
            Hủy
          </CustomButton>
          <CustomButton disabled={isLoading} className="!h-11 w-full" onClick={onSuccess}>
            Xóa
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;
