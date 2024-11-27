import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { createCustomer } from "@/api/customer.service";
import { getGroupCustomer } from "@/api/group-customer";
import DateIcon from "@/assets/dateIcon.svg";
// import SearchIcon from '@/assets/searchIcon.svg';
import UserUploadIcon from "@/assets/userUploadIcon.svg";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomUpload } from "@/components/CustomUpload";
import InputError from "@/components/InputError";
import { ECustomerStatus, ECustomerType, EGender } from "@/enums";
import { formatDate, hasPermission } from "@/helpers";
import PlusIcon from "@/assets/plusIcon.svg";
import MarkIcon from "@/assets/markIcon.svg";
import { useAddress } from "@/hooks/useAddress";
import { schema } from "../partners/customer/add-customer/schema";
import { AddGroupCustomerModal } from "../partners/group-customer/AddGroupCustomerModal";
import { branchState, profileState } from "@/recoil/state";
import { useRecoilState, useRecoilValue } from "recoil";
import { getBranch } from "@/api/branch.service";
import { RoleAction, RoleModel } from "../settings/role/role.enum";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { searchPlace } from "@/api/trip.service";

export function CreateCustomerModal({
  isOpen,
  onCancel,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: ({ customerId, CustomerName }) => void;
}) {
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);

  const [branchId, setBranch] = useRecoilState(branchState);
  const [refId, setRefId] = useState("");
  const [tempKeyword, setTempKeyword] = useState("");

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      status: ECustomerStatus.active,
      gender: EGender.male,
      type: ECustomerType.PERSONAL,
    },
  });

  const [groupCustomerKeyword, setGroupCustomerKeyword] = useState();
  const [groupCustomer, setGroupCustomer] = useState<boolean>(false);
  const [placeKeyword, setPlaceKeyword] = useState("");

  const { provinces, districts, wards } = useAddress(getValues("provinceId"), getValues("districtId"));

  const { data: groupCustomers } = useQuery(["GROUP_CUSTOMER", groupCustomerKeyword], () =>
    getGroupCustomer({ page: 1, limit: 20, keyword: groupCustomerKeyword }),
  );

  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () => searchPlace({ keyword: placeKeyword }),
    {
      enabled: placeKeyword.length > 0,
    },
  );

  const { mutate: mutateCreateCustomer, isLoading: isLoadingCreateCustomer } = useMutation(
    () =>
      createCustomer({
        ...getValues(),
        branchId,
      }),
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        if (onSave) {
          onSave({
            customerId: res.data.id,
            CustomerName: getValues("fullName"),
          });
        }
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateCustomer();
  };

  const onSearch = useCallback(
    debounce((value) => {
      setPlaceKeyword(value);
    }, 300),
    [placeKeyword],
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      title={
        <div className="text-xl">
          Thêm khách hàng{" "}
          <span className="font-normal text-[#8F90A6]">
            | Chi nhánh tạo: {branches?.data?.items?.find((item) => item.id === branchId)?.name}
          </span>
        </div>
      }
      width={950}
      isLoading={isLoadingCreateCustomer}
    >
      <div className="flex justify-between py-8">
        <div className="mt-3 w-[98px]">
          <CustomUpload onChangeValue={(value) => setValue("avatarId", value, { shouldValidate: true })}>
            <div className="flex flex-col">
              <div className="flex h-[120px] w-[98px] items-center justify-center rounded border-2 border-dashed border-[#C7C9D9]">
                <Image src={UserUploadIcon} />
              </div>

              <div className="mt-2 text-center text-red-main ">Chọn ảnh</div>
            </div>
          </CustomUpload>
        </div>

        <div className="w-[calc(calc(100%-98px)/2)] max-w-[362px]">
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Mã khách hàng</label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) => setValue("code", value, { shouldValidate: true })}
              placeholder="Mã mặc định"
            />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Tên khách hàng</label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) => setValue("fullName", value, { shouldValidate: true })}
              />
            </div>
            <InputError error={errors.fullName?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Số điện thoại</label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) => setValue("phone", value, { shouldValidate: true })}
              />
            </div>
            <InputError error={errors.phone?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Ngày sinh</label>

              <div className="flex">
                <CustomDatePicker
                  placeholder="Ngày sinh"
                  suffixIcon={<Image src={DateIcon} alt="" />}
                  className="h-10 w-full"
                  bordered={false}
                  onChange={(value) =>
                    setValue("birthday", formatDate(value, "YYYY-MM-DD"), {
                      shouldValidate: true,
                    })
                  }
                  value={getValues("birthday")}
                />
                <CustomRadio
                  className="-mr-4 flex"
                  options={[
                    { value: EGender.male, label: "Nam" },
                    { value: EGender.female, label: "Nữ" },
                  ]}
                  onChange={(value) => setValue("gender", value, { shouldValidate: true })}
                  value={getValues("gender")}
                />
              </div>
            </div>

            <InputError error={errors.birthday?.message || errors.gender?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Địa chỉ</label>
              {/* <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) => setValue("address", value, { shouldValidate: true })}
              /> */}
              <CustomAutocomplete
                placeholder="Tìm kiếm địa chỉ"
                className="h-11 !rounded w-full !border-0 !border-b border-[#E4E4EB]"
                // prefixIcon={<Image src={SearchIcon} alt="" />}
                wrapClassName="w-full !rounded bg-white"
                onSelect={(value) => {
                  const addressName = places?.data?.find((item) => item.ref_id === value)?.display;
                  setTempKeyword(addressName);
                  setValue("address", addressName, { shouldValidate: true });
                  setRefId(value);
                }}
                showSearch={true}
                listHeight={300}
                onSearch={(value) => {
                  setTempKeyword(value);
                  onSearch(value);
                }}
                value={tempKeyword}
                options={places?.data.map((item) => ({
                  value: item?.ref_id,
                  label: (
                    <div className="flex items-center gap-1 py-2">
                      <Image src={MarkIcon} />
                      <span className="display">{item?.display}</span>
                    </div>
                  ),
                }))}
              />
            </div>

            <InputError error={errors.address?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Tỉnh/Thành phố</label>
              <CustomSelect
                onChange={(value) => setValue("provinceId", value, { shouldValidate: true })}
                className="border-underline"
                placeholder="Chọn Tỉnh/TP"
                showSearch={true}
                options={provinces?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>
            <InputError error={errors.provinceId?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Phường xã</label>
              <CustomSelect
                onChange={(value) => setValue("wardId", value, { shouldValidate: true })}
                options={wards?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                className="border-underline"
                placeholder="Chọn Phường/Xã"
              />
            </div>
            <InputError error={errors.wardId?.message} />
          </div>
        </div>
        <div className="w-[calc(calc(100%-98px)/2)] max-w-[362px]">
          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Loại khách</label>

              <CustomRadio
                className="-mr-4 flex"
                options={[
                  { value: 1, label: "Cá nhân" },
                  { value: 2, label: "Công ty" },
                ]}
                onChange={(value) => setValue("type", value, { shouldValidate: true })}
                value={getValues("type")}
              />
            </div>

            <InputError error={errors.type?.message} />
          </div>

          {getValues("type") === ECustomerType.COMPANY && (
            <>
              <div className=" mb-5 ">
                <div className="flex items-end">
                  <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Mã số thuế</label>
                  <CustomInput
                    bordered={false}
                    wrapClassName="grow"
                    className="border-[#E4E4EB]"
                    onChange={(value) => setValue("taxCode", value, { shouldValidate: true })}
                  />
                </div>

                <InputError error={errors.taxCode?.message} />
              </div>
              <div className=" mb-5 ">
                <div className="flex items-end">
                  <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Tên công ty</label>
                  <CustomInput
                    bordered={false}
                    wrapClassName="grow"
                    className="border-[#E4E4EB]"
                    onChange={(value) => setValue("companyName", value, { shouldValidate: true })}
                  />
                </div>

                <InputError error={errors.taxCode?.message} />
              </div>
            </>
          )}

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Email</label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) => setValue("email", value, { shouldValidate: true })}
              />
            </div>

            <InputError error={errors.email?.message} />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Facebook</label>
            <CustomInput bordered={false} wrapClassName="grow" className="border-[#E4E4EB]" onChange={() => {}} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Nhóm KH</label>
              <CustomSelect
                mode="multiple"
                options={groupCustomers?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                onChange={(value) => setValue("groupCustomerId", value, { shouldValidate: true })}
                showSearch={true}
                onSearch={debounce((value) => {
                  setGroupCustomerKeyword(value);
                }, 300)}
                suffixIcon={
                  <>
                    {hasPermission(profile?.role?.permissions, RoleModel.group_customer, RoleAction.create) && (
                      <Image
                        src={PlusIcon}
                        onClick={(e) => {
                          setGroupCustomer(true);
                          e.stopPropagation();
                        }}
                        alt=""
                      />
                    )}
                  </>
                }
                value={getValues("groupCustomerId")}
                className="border-underline"
                placeholder="Chọn nhóm khách hàng"
              />
            </div>
            <InputError error={errors.groupCustomerId?.message} />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Quận/Huyện</label>
              <CustomSelect
                onChange={(value) => setValue("districtId", value, { shouldValidate: true })}
                options={districts?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                className="border-underline"
                placeholder="Chọn quận/huyện"
              />
            </div>
            <InputError error={errors.districtId?.message} />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">Ghi chú</label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) => setValue("note", value, { shouldValidate: true })}
            />
          </div>
        </div>
      </div>

      <AddGroupCustomerModal
        isOpen={groupCustomer}
        onCancel={() => {
          setGroupCustomer(false);
        }}
        onSave={({ groupCustomerId, groupCustomerName }) => {
          const oldGroupCustomerId: any = getValues("groupCustomerId");
          // check if oldGroupCustomerId has value
          if (oldGroupCustomerId?.length > 0) {
            setValue("groupCustomerId", [...oldGroupCustomerId, groupCustomerId], { shouldValidate: true });
          } else {
            setValue("groupCustomerId", [groupCustomerId], { shouldValidate: true });
          }
          setGroupCustomerKeyword(groupCustomerName);
        }}
      />
    </CustomModal>
  );
}
