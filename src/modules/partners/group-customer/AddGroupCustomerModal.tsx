import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  createGroupCustomer,
  getGroupCustomerDetail,
  updateGroupCustomer,
} from "@/api/group-customer";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import InputError from "@/components/InputError";

import { schema } from "./schema";

export function AddGroupCustomerModal({
  groupCustomerId,
  isOpen,
  onCancel,
  onSave,
}: {
  groupCustomerId?: number;
  isOpen: boolean;
  onCancel: () => void;
  onSave?: ({ groupCustomerId, groupCustomerName }) => void;
}) {
  const queryClient = useQueryClient();

  const { data: groupCustomerDetail } = useQuery(
    ["GROUP_CUSTOMER_DETAIL", groupCustomerId],
    () => getGroupCustomerDetail(Number(groupCustomerId)),
    { enabled: !!groupCustomerId }
  );
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    mutate: mutateCreateGroupCustomer,
    isLoading: isLoadingCreateGroupCustomer,
  } = useMutation(
    () =>
      groupCustomerDetail
        ? updateGroupCustomer(groupCustomerDetail?.data?.id, getValues())
        : createGroupCustomer(getValues()),
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["GROUP_CUSTOMER"]);

        if (onSave) {
          onSave({
            groupCustomerId: res.data.id,
            groupCustomerName: getValues("name"),
          });
        }

        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateCreateGroupCustomer();
  };

  useEffect(() => {
    if (groupCustomerDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(groupCustomerDetail.data[key])) {
          setValue(key, groupCustomerDetail.data[key], {
            shouldValidate: true,
          });
        }
      });
    }
  }, [groupCustomerDetail]);

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={() => {
        reset();
        onCancel();
      }}
      title={
        groupCustomerDetail
          ? "Cập nhật nhóm khách hàng"
          : "Thêm mới nhóm khách hàng"
      }
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateGroupCustomer}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5 grid grid-cols-2 gap-x-8">
        <div>
          <Label infoText="" label="Tên nhóm khách hàng" required />
          <CustomInput
            placeholder="Nhập tên nhóm"
            className="h-11"
            onChange={(e) => setValue("name", e, { shouldValidate: true })}
            value={getValues("name")}
          />
          <InputError error={errors.name?.message} />
        </div>

        <div>
          <Label infoText="" label="Chiết khấu" />
          <CustomInput
            placeholder="0.0"
            className="h-11"
            onChange={(e) => setValue("discount", +e, { shouldValidate: true })}
            type="number"
            value={getValues("discount")}
          />
        </div>
      </div>

      <div>
        <Label infoText="" label="Mô tả" />
        <CustomTextarea
          rows={10}
          placeholder="Nhập Mô tả"
          onChange={(e) =>
            setValue("description", e.target.value, { shouldValidate: true })
          }
          value={getValues("description")}
        />
      </div>
    </CustomModal>
  );
}
