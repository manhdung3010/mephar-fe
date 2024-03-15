import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import { CustomSelect } from '@/components/CustomSelect';

export function AddStageModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  return (
    <CustomModal
      title="Thêm khu vực vận chuyển"
      isOpen={isOpen}
      onCancel={onCancel}
      width={680}
      textOk="Lưu"
      textCancel="Hủy"
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div>
        <Label label="Nhập khu vực vận chuyển" required hasInfoIcon={false} />
        <CustomSelect onChange={() => {}} className="h-11 !rounded" />
      </div>
    </CustomModal>
  );
}
