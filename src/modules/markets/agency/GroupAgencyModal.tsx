import Image from 'next/image';

import CloseCircleGrayIcon from '@/assets/closeCircleGrayIcon.svg';
import BoyImg from '@/assets/images/boy 1.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import ArrowDownIcon from '@/assets/arrowDownIcon.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { getAgencyGroup } from '@/api/market.service';
import { useState } from 'react';
import AddGroupAgencyModal from './AddGroupAgencyModal';
import { message } from 'antd';

const GroupAgencyModal = ({
  isOpen,
  onCancel,
  onSuccess,
  onClose,
  content,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSuccess?: any;
  content: string;
  isLoading?: boolean;
}) => {
  const branchId = useRecoilValue(branchState);
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  const { data: agencyGroup, isLoading: isLoadingGroup } = useQuery(
    ['GROUP_AGENCY_LIST', branchId],
    () => getAgencyGroup({ page: 1, limit: 999 }),
    {
      enabled: !!branchId && !!isOpen,
    }
  );

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onClose}
      onSubmit={onCancel}
      customFooter
      width={600}
    >
      <div className="flex flex-col gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Chọn nhóm đại lý</div>
        <div>
          <Label label='Nhóm đại lý' />
          <CustomSelect
            options={agencyGroup?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={(value) => {
              setAgencyId(value);
            }}
            value={agencyId}
            showSearch={true}
            className="!rounded !h-11"
            placeholder="Chọn nhóm đại lý"
            suffixIcon={
              <div className="flex items-center gap-2">
                <Image src={ArrowDownIcon} alt="" />
                <Image
                  src={PlusCircleIcon}
                  alt=""
                  onClick={() => setOpenAddGroupModal(true)}
                />
              </div>
            }
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={onClose}
          >
            Bỏ qua
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 w-full"
            onClick={() => {
              if (!agencyId) {
                onCancel();
              }
              onSuccess && onSuccess({ agencyId: agencyId || '' });
            }}
          >
            Xác nhận
          </CustomButton>
        </div>
      </div>

      <AddGroupAgencyModal
        isOpen={openAddGroupModal}
        onCancel={() => setOpenAddGroupModal(false)}
        onSuccess={({ groupAgencyId, groupAgencyName }) => {
          setAgencyId(groupAgencyId);
          setOpenAddGroupModal(false);
        }}
      />
    </CustomModal>
  );
};

export default GroupAgencyModal;
