import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import Image from 'next/image';

import { deleteGroupProvider } from '@/api/group-provider';
import UserImage from '@/assets/images/user.png';
import QuestionIcon from '@/assets/questionIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';

export function RemoveGroupProviderModal({
  isOpen,
  onCancel,
  id,
}: {
  isOpen: boolean;
  onCancel: () => void;
  id: number;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: mutateDeleteGroupProvider,
    isLoading: isLoadingDeleteGroupProvider,
  } = useMutation(
    () => {
      return deleteGroupProvider(id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['GROUP_PROVIDER']);
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateDeleteGroupProvider();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Xóa nhóm nhà cung cấp"
      width={520}
      customFooter={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div>
        <div className="relative mb-6 flex justify-center">
          <Image src={UserImage} alt="" />

          <div className=" absolute top-0 right-[calc(50%-58px)]">
            <Image src={QuestionIcon} />
          </div>
        </div>
        <div className="mb-6 text-center text-lg">
          Bạn có chắc chắn muốn xóa nhóm nhà cung cấp?
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CustomButton
            type="danger"
            outline={true}
            className="!h-11"
            onClick={onCancel}
          >
            Hủy
          </CustomButton>
          <CustomButton
            type="danger"
            className="!h-11"
            disabled={isLoadingDeleteGroupProvider}
            onClick={onSubmit}
          >
            Xóa
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
