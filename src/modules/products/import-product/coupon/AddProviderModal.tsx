import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import { getBranch } from "@/api/branch.service";
import { getGroupProvider } from "@/api/group-provider";
import { createProvider } from "@/api/provider.service";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import { useAddress } from "@/hooks/useAddress";

import { schema } from "../../../partners/provider/add-provider/schema";
import { AddGroupProviderModal } from "@/modules/partners/group-provider/AddGroupProviderModal";

export function AddProviderModal({
  isOpen,
  onCancel,
  setProductImportValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setProductImportValue: any;
}) {
  const queryClient = useQueryClient();

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

  const [groupProviderKeyword, setGroupProviderKeyword] = useState();
  const [isOpenAddGroupProvider, setIsOpenAddGroupProvider] = useState(false);

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());
  const { data: groupProviders } = useQuery(["GROUP_PROVIDER", groupProviderKeyword], () =>
    getGroupProvider({ page: 1, limit: 20, keyword: groupProviderKeyword }),
  );
  const { provinces, districts, wards } = useAddress(getValues("provinceId"), getValues("districtId"));

  const { mutate: mutateCreateProvider, isLoading: isLoadingCreateProvider } = useMutation(
    () => createProvider(getValues()),
    {
      onSuccess: async (res) => {
        setProductImportValue("supplierId", res.data.id, {
          shouldValidate: true,
        });
        await queryClient.invalidateQueries(["PROVIDER_LIST"]);
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateProvider();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      title="Thêm mới nhà cung cấp"
      width={950}
      isLoading={isLoadingCreateProvider}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã nhà cung cấp" />
          <CustomInput
            placeholder="Mã mặc định"
            className="h-11"
            onChange={(e) => setValue("code", e, { shouldValidate: true })}
            value={getValues("code")}
          />
        </div>
        <div>
          <Label infoText="" label="Tên nhà cung cấp" required />
          <CustomInput
            placeholder="Nhập tên nhà cung cấp"
            className="h-11"
            onChange={(e) => setValue("name", e, { shouldValidate: true })}
            value={getValues("name")}
          />
          <InputError error={errors.name?.message} />
        </div>

        <div>
          <Label infoText="" label="Số điện thoại" required />
          <CustomInput
            placeholder="Nhập số điện thoại"
            className="h-11"
            onChange={(e) => setValue("phone", e, { shouldValidate: true })}
            value={getValues("phone")}
          />
          <InputError error={errors.phone?.message} />
        </div>

        <div>
          <Label infoText="" label="Email" />
          <CustomInput
            placeholder="Email"
            className="h-11"
            onChange={(e) => setValue("email", e, { shouldValidate: true })}
            value={getValues("email")}
          />
        </div>

        <div>
          <Label infoText="" label="Công ty" />
          <CustomInput
            placeholder="Tên công ty"
            className="h-11"
            onChange={(e) =>
              setValue("companyName", e, {
                shouldValidate: true,
              })
            }
            value={getValues("companyName")}
          />
        </div>

        <div>
          <Label infoText="" label="Mã số thuế" />
          <CustomInput
            placeholder="Mã số thuế"
            className="h-11"
            onChange={(e) => setValue("taxCode", e, { shouldValidate: true })}
            value={getValues("taxCode")}
          />
        </div>

        <div>
          <Label infoText="" label="Nhóm NCC" required />
          <CustomSelect
            onChange={(value) => setValue("groupSupplierId", value, { shouldValidate: true })}
            className="h-11 !rounded"
            placeholder="Chọn nhóm NCC"
            options={groupProviders?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("groupSupplierId")}
            showSearch={true}
            onSearch={debounce((value) => {
              setGroupProviderKeyword(value);
            }, 300)}
            suffixIcon={
              <div>
                <Image src={ArrowDownIcon} alt="" />
                <Image src={PlusCircleIcon} alt="" onClick={() => setIsOpenAddGroupProvider(true)} />
              </div>
            }
          />
          <InputError error={errors.groupSupplierId?.message} />
        </div>

        <div>
          <Label infoText="" label="Địa chỉ" />
          <CustomInput
            placeholder="Nhập địa chỉ"
            className="h-11"
            onChange={(e) => setValue("address", e, { shouldValidate: true })}
            value={getValues("address")}
          />
        </div>

        <div>
          <Label infoText="" label="Tỉnh/Thành" />
          <CustomSelect
            onChange={(value) => setValue("provinceId", value, { shouldValidate: true })}
            options={provinces?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("provinceId")}
            className=" h-11 !rounded"
            placeholder="Chọn tỉnh/thành"
            showSearch={true}
          />
          <InputError error={errors.provinceId?.message} />
        </div>

        <div>
          <Label infoText="" label="Quận/Huyện" />
          <CustomSelect
            onChange={(value) => setValue("districtId", value, { shouldValidate: true })}
            options={districts?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("districtId")}
            className=" h-11 !rounded"
            placeholder="Chọn quận/huyện"
            showSearch={true}
          />
          <InputError error={errors.districtId?.message} />
        </div>

        <div>
          <Label infoText="" label="Phường/xã" />
          <CustomSelect
            onChange={(value) => setValue("wardId", value, { shouldValidate: true })}
            options={wards?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            value={getValues("wardId")}
            className=" h-11 !rounded"
            placeholder="Chọn phường/xã"
          />
          <InputError error={errors.wardId?.message} />
        </div>
      </div>

      <div>
        <Label infoText="" label="Ghi chú" />
        <CustomTextarea
          rows={10}
          placeholder="Nhập ghi chú"
          onChange={(e) => setValue("note", e.target.value, { shouldValidate: true })}
          value={getValues("note")}
        />
      </div>

      <AddGroupProviderModal
        isOpen={isOpenAddGroupProvider}
        onCancel={() => {
          setIsOpenAddGroupProvider(false);
        }}
        onSuccess={({ groupProviderId, groupProviderName }) => {
          setGroupProviderKeyword(groupProviderName);
          setValue("groupSupplierId", groupProviderId, {
            shouldValidate: true,
          });
        }}
      />
    </CustomModal>
  );
}
