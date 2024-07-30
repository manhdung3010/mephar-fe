import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

import { getBranch } from "@/api/branch.service";
import {
  createGroupProvider,
  getGroupProviderDetail,
  updateGroupProvider,
} from "@/api/group-provider";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import { branchState } from "@/recoil/state";

import { schema } from "./schema";

export function AddGroupProviderModal({
  groupProviderId,
  isOpen,
  onCancel,
  onSuccess,
}: {
  groupProviderId?: number;
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: ({ groupProviderId, groupProviderName }) => void;
}) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const { data: groupProviderDetail } = useQuery(
    ["GROUP_PROVIDER_DETAIL", groupProviderId],
    () => getGroupProviderDetail(Number(groupProviderId)),
    { enabled: !!groupProviderId }
  );

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());

  const {
    getValues,
    setValue,
    reset,

    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    // defaultValues: {
    //   branchId,
    // },
  });

  const {
    mutate: mutateCreateGroupProvider,
    isLoading: isLoadingCreateGroupProvider,
  } = useMutation(
    () =>
      groupProviderDetail
        ? updateGroupProvider(groupProviderDetail?.data?.id, getValues())
        : createGroupProvider(getValues()),
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["GROUP_PROVIDER"]);

        if (onSuccess) {
          onSuccess({
            groupProviderId: res.data.id,
            groupProviderName: getValues("name"),
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
    mutateCreateGroupProvider();
  };

  useEffect(() => {
    if (groupProviderDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(groupProviderDetail.data[key])) {
          setValue(key, groupProviderDetail.data[key], {
            shouldValidate: true,
          });
        }
      });
    }
  }, [groupProviderDetail]);

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={() => {
        reset();
        onCancel();
      }}
      title={
        groupProviderDetail
          ? "Cập nhật nhóm nhà cung cấp"
          : "Thêm mới nhóm nhà cung cấp"
      }
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateGroupProvider}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5 grid grid-cols-1 gap-x-8">
        <div>
          <Label infoText="" label="Tên nhóm nhà cung cấp" required />
          <CustomInput
            placeholder="Nhập tên nhóm"
            className="h-11"
            onChange={(e) => setValue("name", e, { shouldValidate: true })}
            value={getValues("name")}
          />
          <InputError error={errors.name?.message} />
        </div>

        {/* <div>
          <Label infoText="" label="Chi nhánh" />
          <CustomSelect
            onChange={(value) => {
              setValue('branchId', value, { shouldValidate: true });
            }}
            options={branches?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            className="h-11 !rounded"
            value={getValues('branchId')}
          />
          <InputError error={errors.branchId?.message} />
        </div> */}
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
        <InputError error={errors.description?.message} />
      </div>
    </CustomModal>
  );
}
