import { useState } from 'react';

import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { CustomSelect } from '@/components/CustomSelect';
import { EDiscountType } from '@/enums';

export function CreateDiscountModal({
  isOpen,
  onCancel,
  getValues,
  setValue,
}: {
  getValues?: any;
  setValue?: any;
  isOpen: boolean;
  onCancel: () => void;
}) {
  const [discountValue, setDiscountValue] = useState(getValues('discount'));
  const [discountType, setDiscountType] = useState(
    getValues('discountType') || EDiscountType.MONEY
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={() => {
        if (discountValue) {
          setValue('discountType', discountType, { shouldValidate: true });
          setValue('discount', discountValue, { shouldValidate: true });
        } else {
          setValue('discountType', undefined, { shouldValidate: true });
          setValue('discount', undefined, { shouldValidate: true });
        }

        onCancel();
      }}
      title="Thêm chiết khấu"
      width={528}
    >
      <div className="py-8">
        <div className=" flex items-end">
          <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
            Giá trị
          </label>

          <div className="flex items-end">
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) => setDiscountValue(value)}
              type="number"
            />
            <CustomSelect
              onChange={(value) => {
                setDiscountType(value);
              }}
              value={discountType}
              wrapClassName="!w-[88px] "
              className="!h-8 !rounded !rounded-l-none !border-none"
              options={[
                {
                  value: EDiscountType.MONEY,
                  label: 'VNĐ',
                },
                {
                  value: EDiscountType.PERCENT,
                  label: '%',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
