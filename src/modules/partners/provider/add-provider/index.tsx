import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getBranch } from "@/api/branch.service";
import { getGroupProvider } from "@/api/group-provider";
import { createProvider, getProviderDetail, updateProvider } from "@/api/provider.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import { useAddress } from "@/hooks/useAddress";

import { AddGroupProviderModal } from "../../group-provider/AddGroupProviderModal";
import { schema } from "./schema";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

export function AddProvider({ providerId }: { providerId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [isOpenAddGroupProvider, setIsOpenAddGroupProvider] = useState(false);

  const [groupProviderKeyword, setGroupProviderKeyword] = useState();

  const { data: providerDetail } = useQuery(
    ["PROVIDE_DETAIL", providerId],
    () => getProviderDetail(Number(providerId)),
    { enabled: !!providerId },
  );

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());
  const { data: groupProviders } = useQuery(["GROUP_PROVIDER", groupProviderKeyword], () =>
    getGroupProvider({ page: 1, limit: 20, keyword: groupProviderKeyword }),
  );
  const { provinces, districts, wards } = useAddress(getValues("provinceId"), getValues("districtId"));

  const { mutate: mutateCreateProvider, isLoading: isLoadingCreateProvider } = useMutation(
    () => (providerDetail ? updateProvider(providerDetail?.data?.id, getValues()) : createProvider(getValues())),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["PROVIDER_LIST"]);

        router.push("/partners/provider");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateProvider();
  };

  const profile = useRecoilValue(profileState);
  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.provider, RoleAction.create)) {
        message.error("Bạn không có quyền truy cập vào trang này");
        router.push("/partners/provider");
      }
    }
  }, [profile?.role?.permissions]);

  useEffect(() => {
    if (providerDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(providerDetail.data[key])) {
          setValue(key, providerDetail.data[key], { shouldValidate: true });
        }
      });

      setGroupProviderKeyword(providerDetail.data?.groupSupplier?.name);
    }
  }, [providerDetail]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {providerDetail ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true} type="danger" onClick={() => router.push("/partners/provider")}>
            Hủy bỏ
          </CustomButton>
          <CustomButton type="danger" disabled={isLoadingCreateProvider} onClick={handleSubmit(onSubmit)}>
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6">
        <div className="grow  bg-white p-5">
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

            {/* <div>
              <Label infoText="" label="Chi nhánh" />
              <CustomSelect
                onChange={(value) =>
                  setValue('branchId', value, { shouldValidate: true })
                }
                className="h-11 !rounded"
                placeholder="Chi nhánh mặc định"
                options={branches?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('branchId')}
              />
              <InputError error={errors.branchId?.message} />
            </div> */}

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
              <InputError error={errors.email?.message} />
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
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} alt="" />
                    <Image src={PlusCircleIcon} alt="" onClick={() => setIsOpenAddGroupProvider(true)} />
                  </div>
                }
              />
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
        </div>
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
    </>
  );
}
