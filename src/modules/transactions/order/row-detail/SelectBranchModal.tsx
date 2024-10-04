import { getBranch } from "@/api/branch.service";
import { createPaymentOrder, updateMarketOrderStatus } from "@/api/market.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import { formatMoney } from "@/helpers";
import { branchState } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import React from "react";
import { useRecoilValue } from "recoil";

function SelectBranchModal({ isOpen, onCancel, id }: { isOpen: boolean; onCancel: () => void; id: string }) {
  const queryClient = useQueryClient();
  const [branchId, setBranchId] = React.useState(null);

  const { mutate: mutateConfirm, isLoading: isLoadingCreate } = useMutation(
    () => {
      return updateMarketOrderStatus(id, { status: "confirm", toBranchId: branchId });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["MAKET_ORDER"]);
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const { data: branches, isLoading: isLoading } = useQuery(["SETTING_BRANCH_1"], () => getBranch(), {
    enabled: !!isOpen,
  });

  const onSubmit = () => {
    if (!branchId) {
      message.error("Vui lòng chọn chi nhánh bán hàng");
      return;
    }
    mutateConfirm();
  };

  return (
    <CustomModal title="Chọn chi nhánh bán hàng" isOpen={isOpen} onCancel={onCancel} width={600} customFooter={true}>
      <div className="my-5">
        <CustomSelect
          value={branchId}
          onChange={(value) => {
            setBranchId(value);
          }}
          options={branches?.data?.items?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          isLoading={true}
          className="h-11 !rounded"
          placeholder={`Chọn chi nhánh bán hàng`}
        />
      </div>
      <CustomButton className="ml-auto !h-11 !w-[120px] mt-3" loading={isLoadingCreate} onClick={onSubmit}>
        Xác nhận
      </CustomButton>
    </CustomModal>
  );
}

export default SelectBranchModal;
