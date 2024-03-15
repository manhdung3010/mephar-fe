import { Checkbox } from 'antd';
import Image from 'next/image';

import ReceiptIcon from '@/assets/receiptIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import { CustomSelect } from '@/components/CustomSelect';

export function AddCashbookModal({
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
      title="Lập phiếu thu (Tiền mặt)"
      width={650}
      customFooter={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="grid grid-cols-2 gap-x-8">
        <div className="mb-5">
          <Label infoText="" label="Mã phiếu" />
          <CustomInput
            onChange={() => {}}
            placeholder="Mã phiếu tự động"
            className="h-11"
          />
        </div>

        <div className="mb-5">
          <Label infoText="" label="Đối tượng nộp" required />
          <CustomSelect
            onChange={() => {}}
            className="h-11 !rounded"
            placeholder="Chọn đối tượng nộp"
          />
        </div>

        <div className="mb-5">
          <Label infoText="" label="Thời gian" />
          <CustomDatePicker className="h-11 w-full !rounded" />
        </div>

        <div className="mb-5">
          <Label infoText="" label="Tên người nộp" required />
          <CustomSelect
            onChange={() => {}}
            className="h-11 !rounded"
            placeholder="Chọn đối tượng nộp"
          />
        </div>

        <div className="mb-5 ">
          <Label infoText="" label="Giá trị" required />
          <CustomInput
            placeholder="Nhập giá trị "
            className="h-11"
            onChange={() => {}}
          />
        </div>

        <div className="mb-5 flex items-end">
          <Checkbox className="mr-3" />
          Thanh toán hóa đơn nợ
        </div>
      </div>

      <div className="mb-5">
        <Label infoText="" label="Ghi chú" />
        <CustomTextarea rows={6} placeholder="Nhập ghi chú" />
      </div>

      <div className="flex justify-end">
        <CustomButton
          type="success"
          prefixIcon={<Image src={ReceiptIcon} alt="" />}
        >
          Lập phiếu thu
        </CustomButton>
      </div>
    </CustomModal>
  );
}
