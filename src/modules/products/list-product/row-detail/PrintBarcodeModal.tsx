import Image from 'next/image';

import CloseCircleGrayIcon from '@/assets/closeCircleGrayIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { useState } from 'react';
import JsBarcode from 'jsbarcode';

const PrintBarcode = ({
  isOpen,
  onCancel,
  barCode
}: {
  isOpen: boolean;
  onCancel: () => void;
  barCode: string;
}) => {

  const [quantity, setQuantity] = useState<number>(1);

  const handlePrint = () => {
    const printWindow: any = window.open('', '_blank');
    for (let i = 0; i < quantity; i++) {
      const img = document.createElement('img');
      JsBarcode(img, barCode);
      printWindow.document.body.appendChild(img);
    }
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={420}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">In mã vạch</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <div className="flex w-full items-center justify-around gap-1">
          <div className="whitespace-nowrap text-lg text-[#000000]">
            Số lượng bản in
          </div>
          <CustomInput
            className="mt-0 h-[26px]"
            bordered={false}
            value={quantity}
            type='number'
            onChange={(value) => setQuantity(value)}
          />
          <div className="flex h-[28px] border border-[#F2F2F5]">
            <div className="flex cursor-pointer items-center justify-center rounded-l bg-[#3E7BFA] p-2 text-base leading-5 text-white" onClick={() => setQuantity(quantity + 1)}>
              +
            </div>
            <div onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="flex cursor-pointer items-center justify-center rounded-r bg-white p-2 text-base leading-5 text-[#3E7BFA]">
              -
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={onCancel}
          >
            Hủy
          </CustomButton>
          <CustomButton className="!h-11 w-full" onClick={handlePrint}>
            In
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default PrintBarcode;
