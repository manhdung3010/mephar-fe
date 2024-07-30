import Image from 'next/image';

import CloseCircleGrayIcon from '@/assets/closeCircleGrayIcon.svg';
import BoyImg from '@/assets/images/boy 1.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomerStatus } from '@/api/trip.service';
import { message } from 'antd';
import { ECustomerStatus } from '../enum';
import ConfirmUpdateLocationModal from './ConfirmUpdateLocation';
import { boolean } from 'yup';

const UpdateStatusModal = ({
  isOpen,
  onCancel,
  onSuccess,
  content,
  isLoading,
  tripCustomerId
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  content: any;
  isLoading?: boolean;
  tripCustomerId: any;
}) => {
  const queryClient = useQueryClient();
  const [openLocationModal, setOpenLocationModal] = useState<boolean>(false);
  const [isNewLocation, setIsNewLocation] = useState<boolean>(false);

  const { mutate: mutateUpdateCustomerStatus, isLoading: isLoadingStatus } =
    useMutation(
      (status: string) => {
        const payload = {
          isUpdateAddress: status === ECustomerStatus.SKIP ? false : status === ECustomerStatus.WAITED ? isNewLocation : true,
        }
        return updateCustomerStatus(tripCustomerId, status, payload);
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["TRIP_DETAIL"]);

          onCancel();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );
  const onSubmit = (status: string, isNewLocation?: any) => {
    setIsNewLocation(isNewLocation);
    mutateUpdateCustomerStatus(status);
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
      <div className="flex flex-col items-center justify-center gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">Cập nhật trạng thái</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <Image src={BoyImg} alt="" />
        <div className="flex text-center">
          <span className='text-lg'>Bạn có muốn cập nhật trạng thái của KH<span className='font-semibold text-lg mx-1'>{content?.fullName}</span> trong lịch trình?</span>
        </div>

        <div className="grid w-full grid-cols-3 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={() => onSubmit('skip')}
            type='danger'
          >
            Bỏ qua
          </CustomButton>
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={() => setOpenLocationModal(true)}
            type='primary'
          >
            Gặp sau
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            type='success'
            className="!h-11 w-full"
            onClick={() => onSubmit('visited')}
          >
            Đã gặp
          </CustomButton>
        </div>
      </div>

      <ConfirmUpdateLocationModal
        isOpen={openLocationModal}
        onCancel={() => setOpenLocationModal(false)}
        onDenied={() => {
          onSubmit('waited', false);
          setOpenLocationModal(false);
        }}
        onSuccess={() => {
          onSubmit('waited', true)
          setOpenLocationModal(false);
        }}
        isLoading={isLoadingStatus}
      />
    </CustomModal>
  );
};

export default UpdateStatusModal;
