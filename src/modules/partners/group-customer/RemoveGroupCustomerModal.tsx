import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import Image from "next/image";

import { deleteGroupCustomer } from "@/api/group-customer";
import UserImage from "@/assets/images/user.png";
import QuestionIcon from "@/assets/questionIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";

export function RemoveGroupCustomerModal({
  isOpen,
  onCancel,
  id,
}: {
  id: number;
  isOpen: boolean;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteEmployee, isLoading: isLoadingDeleteEmployee } = useMutation(
    () => {
      return deleteGroupCustomer(id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["GROUP_CUSTOMER"]);
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteEmployee();
  };

  return (
    <CustomModal isOpen={isOpen} onCancel={onCancel} title="Xóa sản phẩm" width={520} customFooter={true}>
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div>
        <div className="relative mb-6 flex justify-center">
          <Image src={UserImage} alt="" />

          <div className=" absolute top-0 right-[calc(50%-58px)]">
            <Image src={QuestionIcon} />
          </div>
        </div>
        <div className="mb-6 text-lg">Bạn có chắc chắn muốn xóa nhóm khách hàng?</div>
        <div className="grid grid-cols-2 gap-4">
          <CustomButton type="danger" outline={true} className="!h-11" onClick={onCancel}>
            Hủy
          </CustomButton>
          <CustomButton type="danger" disabled={isLoadingDeleteEmployee} className="!h-11" onClick={onSubmit}>
            Xóa
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
