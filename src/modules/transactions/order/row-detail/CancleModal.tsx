import Image from "next/image";

import CloseCircleGrayIcon from "@/assets/closeCircleGrayIcon.svg";
import BoyImg from "@/assets/images/boy 1.png";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import Label from "@/components/CustomLabel";
import { CustomTextarea } from "@/components/CustomInput";
import { useState } from "react";

/**
 * CancleModal component renders a modal for updating the status of an item.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {() => void} props.onCancel - Function to call when the cancel button is clicked.
 * @param {() => void} [props.onSuccess] - Optional function to call when the success button is clicked.
 * @param {string} props.content - The content to be displayed in the modal.
 * @param {boolean} [props.isLoading] - Optional flag to indicate if the update action is in progress.
 *
 * @returns {JSX.Element} The rendered CancleModal component.
 */
const CancleModal = ({
  isOpen,
  onCancel,
  onSuccess,
  content,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: (note) => void;
  content: string;
  isLoading?: boolean;
}) => {
  const [note, setNote] = useState<any>("");
  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={500}
    >
      <div className="flex flex-col gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Hủy bỏ {content}</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <div>
          <Label label="Lý do hủy (giao hàng thất bại)" />
          <CustomTextarea
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập lý do hủy (giao hàng thất bại)..."
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton outline={true} className="!h-11 w-full" onClick={onCancel}>
            Hủy
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 w-full"
            onClick={() => {
              onSuccess && onSuccess(note);
              setNote("");
            }}
          >
            Xác nhận
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CancleModal;
