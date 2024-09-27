import Image from 'next/image';

import CloseCircleGrayIcon from '@/assets/closeCircleGrayIcon.svg';
import BoyImg from '@/assets/images/boy 1.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { branchState, storeState } from '@/recoil/state';
import ArrowDownIcon from '@/assets/arrowDownIcon.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { createAgencyGroup, getAgencyGroup } from '@/api/market.service';
import { useState } from 'react';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import { message } from 'antd';

const AddGroupAgencyModal = ({
  isOpen,
  onCancel,
  onSuccess,
  content,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: any;
  content?: string;
  isLoading?: boolean;
}) => {
  const branchId = useRecoilValue(branchState);
  const storeId = useRecoilValue(storeState);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>({
    name: '',
    description: '',
  });

  const { mutate: mutateCreateGroupAgency, isLoading: isLoadingCreate } =
    useMutation(
      () => {
        return createAgencyGroup({ ...data });
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(["GROUP_AGENCY_LIST"]);
          if (onSuccess) {
            onSuccess({
              groupAgencyId: res.data.id,
              groupAgencyName: data.name,
            });
          }
          setData({ name: '', description: '' });
          onCancel();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );
  const onSubmit = () => {
    if (!data.name) {
      message.error('Vui lòng nhập tên nhóm đại lý');
      return;
    }
    mutateCreateGroupAgency();
  }

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={600}
    >
      <div className="flex flex-col gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Chọn nhóm đại lý</div>
        <div>
          <Label label='Tên đại lý' required />
          <CustomInput
            value={data.name}
            onChange={(value) => {
              setData((preValue) => ({ ...preValue, name: value }));
            }}
            placeholder="Tên đại lý"
            className="!h-11"
          />
          <div className='mt-3'>
            <Label label='Mô tả' />
            <CustomTextarea
              rows={5}
              value={data.description}
              onChange={(e) => {
                setData((preValue) => ({ ...preValue, description: e.target.value }));
              }}
              placeholder="Nhập mô tả"
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={onCancel}
          >
            Đóng
          </CustomButton>
          <CustomButton
            disabled={isLoadingCreate}
            className="!h-11 w-full"
            onClick={onSubmit}
            loading={isLoadingCreate}
          >
            Thêm
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddGroupAgencyModal;
