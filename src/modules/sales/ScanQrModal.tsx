import Image from 'next/image';

import QR from '@/assets/images/qr.png';
import { CustomModal } from '@/components/CustomModal';

export function ScanQrModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  return (
    <CustomModal width={400} isOpen={isOpen} onCancel={onCancel} footer={null}>
      <Image src={QR} alt="" width={350} height={350} />
    </CustomModal>
  );
}
