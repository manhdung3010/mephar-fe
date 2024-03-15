import { Checkbox } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

import InfoIcon from '@/assets/info-circle.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';

enum ECollectPointType {
  BILL = 'BILL',
  GOODS = 'GOODS',
}

export function SettingCollectPointModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const [settingCollectPointType, setSettingCollectPointType] = useState(
    ECollectPointType.BILL
  );

  return (
    <CustomModal
      title="Thiết lập điểm"
      isOpen={isOpen}
      onCancel={onCancel}
      width={800}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <CustomRadio
        options={[
          {
            value: ECollectPointType.BILL,
            label: (
              <div className="flex items-center gap-1 font-medium">
                Hóa đơn
                <Image src={InfoIcon} alt="" />
              </div>
            ),
          },
          {
            value: ECollectPointType.GOODS,
            label: (
              <div className="flex items-center gap-1 font-medium">
                Hàng hóa
                <Image src={InfoIcon} alt="" />
              </div>
            ),
          },
        ]}
        className="mb-2 !flex items-center gap-8"
        value={settingCollectPointType}
        onChange={(value) => {
          setSettingCollectPointType(value);
        }}
      />

      <div className="mb-4 flex items-center">
        <Checkbox className="mr-3" />
        <div className="flex w-full items-center gap-2">
          <div className="w-[250px] min-w-[200px]">Tỉ lệ quy đổi điểm</div>
          <CustomInput
            bordered={false}
            className="text-end"
            wrapClassName=" grow"
            onChange={() => {}}
          />
          <div className="rounded bg-[#06F] px-2 py-1 font-medium text-white">
            VND
          </div>
          <div>= 1 điểm thưởng</div>
          <Image src={InfoIcon} />
        </div>
      </div>

      <div className="mb-8 flex items-start">
        <Checkbox className="mr-3" />
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="w-[250px] min-w-[220px]">
              Cho phép thanh toán bằng điểm
            </div>
            <CustomInput
              bordered={false}
              className="text-end"
              onChange={() => {}}
            />
            <div className="rounded bg-[#F80] px-2 py-1 font-medium text-white">
              Điểm
            </div>
            <div>=</div>
            <CustomInput
              bordered={false}
              className="text-end "
              onChange={() => {}}
            />
            <div className="rounded bg-[#06F] px-2 py-1 font-medium text-white">
              VND
            </div>
            <Image src={InfoIcon} />
          </div>

          <div className="flex items-center">
            <div>Thanh toán bằng điểm sau</div>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="text-end"
              onChange={() => {}}
            />
            <div>Lần mua</div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Checkbox className="mr-3" />
        Không tích điểm cho sản phẩm giảm giá
      </div>

      <div className="mb-4 flex items-center">
        <Checkbox className="mr-3" />
        Không tích điểm cho hóa đơn giảm giá
      </div>

      <div className="mb-4 flex items-center">
        <Checkbox className="mr-3" />
        Không tích điểm cho hóa đơn thanh toán bằng điểm thưởng
      </div>

      <div className="mb-8 flex items-center">
        <Checkbox className="mr-3" />
        Không tích điểm cho hóa đơn thanh toán bằng voucher
      </div>

      <CustomRadio
        options={[
          {
            value: 1,
            label: 'Toàn bộ khách hàng',
          },
          {
            value: 2,
            label: (
              <div className="flex items-end gap-2">
                <div className="w-[150px]">Nhóm khách hàng</div>
                <CustomSelect
                  onChange={() => {}}
                  className="border-underline"
                  wrapClassName="grow"
                  placeholder="Chọn nhóm khách hàng"
                />
              </div>
            ),
          },
        ]}
        className="mb-8 !flex flex-col"
      />

      {settingCollectPointType === ECollectPointType.GOODS && (
        <div className="mb-8 flex items-center">
          <Checkbox className="mr-3" />
          <div className="flex grow items-center gap-2">
            <div className="w-[250px] min-w-[200px]">Tỉ lệ quy đổi điểm</div>
            <CustomInput
              bordered={false}
              className="text-end"
              wrapClassName=" grow"
              onChange={() => {}}
            />
            <div className="rounded bg-[#06F] px-2 py-1 font-medium text-white">
              VND
            </div>
            <div>= 1 điểm thưởng</div>
            <Image src={InfoIcon} />
          </div>
        </div>
      )}
    </CustomModal>
  );
}
