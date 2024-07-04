import { CustomModal } from '@/components/CustomModal';
import { Discount } from '@/modules/settings/discount';

function DiscountModal({
  isOpen,
  onCancel,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave?: (value) => void;
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Danh sách khách hàng"
      width={1114}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <Discount />
    </CustomModal>
  )
}

export default DiscountModal