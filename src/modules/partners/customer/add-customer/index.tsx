import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DatePicker, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createCustomer, getCustomerDetail, updateCustomer, updateStatusCustomer } from "@/api/customer.service";
import { getGroupCustomer } from "@/api/group-customer";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import DateIcon from "@/assets/dateIcon.svg";
import PhotographIcon from "@/assets/photograph.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomUpload } from "@/components/CustomUpload";
import InputError from "@/components/InputError";
import { ECustomerStatus, ECustomerType, EGender } from "@/enums";
import { formatDate, hasPermission } from "@/helpers";
import { useAddress } from "@/hooks/useAddress";
import MarkIcon from "@/assets/markIcon.svg";
import { AddGroupCustomerModal } from "../../group-customer/AddGroupCustomerModal";
import { schema } from "./schema";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { getAddress, getLatLng, searchPlace } from "@/api/trip.service";
import dayjs from "dayjs";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import moment from "moment";
const { Option } = Select;

export function AddCustomer({ customerId }: { customerId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const [placeKeyword, setPlaceKeyword] = useState("");
  const [refId, setRefId] = useState("");
  const [tempKeyword, setTempKeyword] = useState("");

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      status: ECustomerStatus.active,
      gender: EGender.male,
      type: ECustomerType.PERSONAL,
      point: "",
    },
  });

  const { data: customerDetail } = useQuery(
    ["CUSTOMER_DETAIL", customerId],
    () => getCustomerDetail(Number(customerId)),
    { enabled: !!customerId },
  );

  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () => searchPlace({ keyword: placeKeyword }),
    {
      enabled: placeKeyword.length > 0,
    },
  );

  const { data: latLng, isLoading: isLoadingLatLng } = useQuery(
    ["SEARCH_LATLNG", refId],
    () => getLatLng({ refId: refId }),
    {
      enabled: refId.length > 0,
    },
  );
  const { data: address, isLoading: isLoadingAddress } = useQuery(
    ["ADDRESS", getValues("point")],
    () =>
      getAddress({
        lat: Number(getValues("point")?.split(",")[0]),
        lng: Number(getValues("point")?.split(",")[1]),
      }),
    {
      enabled: !!getValues("point"),
    },
  );

  useEffect(() => {
    if (address?.data?.address) {
      setValue("address", address?.data?.address, { shouldValidate: true });
      setTempKeyword(address?.data?.address);
    }
  }, [address?.data?.address]);
  useEffect(() => {
    if (latLng) {
      setValue("lng", String(latLng?.data?.lng), { shouldValidate: true });
      setValue("lat", String(latLng?.data?.lat), { shouldValidate: true });
      setValue("point", `${latLng?.data?.lat},${latLng?.data?.lng}`, {
        shouldValidate: true,
      });
      setValue("address", latLng?.data?.display, { shouldValidate: true });
    }
  }, [latLng]);

  useEffect(() => {
    if (getValues("point")) {
      const [lat, lng]: any = getValues("point")?.split(",");
      setValue("lng", lng?.trim(), { shouldValidate: true });
      setValue("lat", lat?.trim(), { shouldValidate: true });
    } else {
      setValue("lng", "", { shouldValidate: true });
      setValue("lat", "", { shouldValidate: true });
    }
  }, [getValues("point")]);

  const { provinces, districts, wards } = useAddress(getValues("provinceId"), getValues("districtId"));

  const [groupCustomerKeyword, setGroupCustomerKeyword] = useState();
  const [openAddGroupCustomerModal, setOpenAddGroupCustomerModal] = useState(false);

  const { data: groupCustomers } = useQuery(["GROUP_CUSTOMER", groupCustomerKeyword], () =>
    getGroupCustomer({ page: 1, limit: 9999, keyword: groupCustomerKeyword }),
  );

  const { mutate: mutateCreateCustomer, isLoading: isLoadingCreateCustomer } = useMutation(
    () => {
      const customerData = {
        ...getValues(),
        branchId,
      };
      if (customerData.point) {
        const [lat, lng]: any = customerData.point.split(",");
        customerData.lat = lat;
        customerData.lng = lng;
      }
      if (customerData?.lat?.length === 0 || customerData?.lng?.length === 0) {
        delete customerData.lat;
        delete customerData.lng;
      }
      delete customerData.point;
      const customerId = customerDetail?.data?.id;

      const customerMutation = customerId ? updateCustomer(customerId, customerData) : createCustomer(customerData);

      const statusMutation = customerId
        ? updateStatusCustomer(customerId, { status: customerData.status })
        : Promise.resolve();

      return Promise.all([customerMutation, statusMutation]);
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        router.push("/partners/customer");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateCustomer();
  };

  const profile = useRecoilValue(profileState);
  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.create)) {
        message.error("Bạn không có quyền truy cập vào trang này");
        router.push("/partners/customer");
      }
    }
  }, [profile?.role?.permissions]);

  useEffect(() => {
    if (customerDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(customerDetail.data[key])) {
          setValue(key, customerDetail.data[key], { shouldValidate: true });
        }
      });
      setValue("address", customerDetail?.data?.address);
      setValue("districtId", customerDetail?.data?.district?.id);
      setValue("wardId", customerDetail?.data?.ward?.id);
      setValue("provinceId", customerDetail?.data?.province?.id);
      setValue("address", customerDetail?.data?.address);
      if (customerDetail?.data?.lat && customerDetail?.data?.lng) {
        setValue("point", `${customerDetail?.data?.lat},${customerDetail?.data?.lng}`, {
          shouldValidate: true,
        });
      } else {
        setValue("point", "", {
          shouldValidate: true,
        });
      }
      setGroupCustomerKeyword(customerDetail.data?.groupCustomer?.name);
      setValue(
        "groupCustomerId",
        customerDetail.data?.listGroupCustomer?.map((item) => item?.groupCustomer?.id),
        { shouldValidate: true },
      );
    }
  }, [customerDetail]);

  const onSearch = useCallback(
    debounce((value) => {
      setPlaceKeyword(value);
    }, 300),
    [placeKeyword],
  );

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {customerDetail ? "Cập nhật khách hàng" : "Thêm mới KHÁCH HÀNG"}
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true} type="danger" onClick={() => router.push("/partners/customer")}>
            Hủy bỏ
          </CustomButton>
          <CustomButton disabled={isLoadingCreateCustomer} onClick={handleSubmit(onSubmit)} type="danger">
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6 flex ">
        <div className="grow  bg-white p-5">
          <div className="mb-5 grid grid-cols-2 md:gap-x-[20px] lg:gap-x-[42px] gap-y-5">
            <div>
              <Label infoText="" label="Mã khách hàng" />
              <CustomInput
                placeholder="Mã mặc định"
                className="h-11"
                disabled={customerId ? true : false}
                onChange={(e) => setValue("code", e, { shouldValidate: true })}
                value={getValues("code")}
              />
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
              <Label infoText="" label="Tên khách hàng" required />
              <CustomInput
                placeholder="Nhập tên khách hàng"
                className="h-11"
                onChange={(e) => setValue("fullName", e, { shouldValidate: true })}
                value={getValues("fullName")}
              />
              <InputError error={errors.fullName?.message} />
            </div>

            <div>
              <Label infoText="" label="Facebook" />
              <CustomInput
                placeholder="Nhập facebook"
                className="h-11"
                onChange={(e) => setValue("facebook", e)}
                value={getValues("facebook")}
              />
              <InputError error={errors.facebook?.message} />
            </div>

            <div>
              <Label infoText="" label="Nhóm khách hàng" />
              <CustomSelect
                mode="multiple"
                options={groupCustomers?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                onChange={(value) => setValue("groupCustomerId", value, { shouldValidate: true })}
                value={getValues("groupCustomerId")}
                showSearch={true}
                onSearch={debounce((value) => {
                  setGroupCustomerKeyword(value);
                }, 300)}
                className="!rounded "
                placeholder="Chọn nhóm khách hàng"
                size="small"
                suffixIcon={
                  <>
                    {hasPermission(profile?.role?.permissions, RoleModel.group_customer, RoleAction.create) && (
                      <div className="flex items-center">
                        <Image src={ArrowDownIcon} alt="" />
                        <Image src={PlusCircleIcon} alt="" onClick={() => setOpenAddGroupCustomerModal(true)} />
                      </div>
                    )}
                  </>
                }
              />
              <InputError error={errors.groupCustomerId?.message} />
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
              <Label infoText="" label="Loại khách" />
              <div className="h-11 rounded-md border border-[#d9d9d9] sm:px-2 lg:px-4 py-[2px]">
                <CustomRadio
                  options={[
                    { value: ECustomerType.PERSONAL, label: "Cá nhân" },
                    { value: ECustomerType.COMPANY, label: "Công ty" },
                  ]}
                  onChange={(value) => setValue("type", value, { shouldValidate: true })}
                  value={getValues("type")}
                />
                <InputError error={errors.type?.message} />
              </div>
            </div>

            <div>
              <Label infoText="" label="Ngày sinh" />
              <CustomDatePicker
                placeholder="Ngày sinh"
                // suffixIcon={<Image src={DateIcon} alt="" />}
                className="h-11 w-full"
                onChange={(value) => {
                  setValue("birthday", value.format("YYYY-MM-DD"), {
                    shouldValidate: true,
                  });
                }}
                value={getValues("birthday") ? moment(getValues("birthday"), "YYYY-MM-DD") : null}
              />
              <InputError error={errors.birthday?.message} />
            </div>

            <div>
              <Label infoText="" label="Giới tính" />
              <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
                <CustomRadio
                  options={[
                    { value: EGender.male, label: "Nam" },
                    { value: EGender.female, label: "Nữ" },
                  ]}
                  onChange={(value) => setValue("gender", value, { shouldValidate: true })}
                  value={getValues("gender")}
                />
                <InputError error={errors.gender?.message} />
              </div>
            </div>

            {getValues("type") === ECustomerType.COMPANY && (
              <>
                <div>
                  <Label infoText="" label="Tên công ty" />
                  <CustomInput
                    placeholder="Tên công ty"
                    className="h-11"
                    onChange={(e) => setValue("companyName", e, { shouldValidate: true })}
                    value={getValues("companyName")}
                  />
                  <InputError error={errors.companyName?.message} />
                </div>
                <div>
                  <Label infoText="" label="Mã số thuế" />
                  <CustomInput
                    placeholder="Mã số thuế"
                    className="h-11"
                    onChange={(e) => setValue("taxCode", e, { shouldValidate: true })}
                    value={getValues("taxCode")}
                  />
                  <InputError error={errors.taxCode?.message} />
                </div>
              </>
            )}
            <div>
              <Label infoText="" label="Địa chỉ" />
              <CustomAutocomplete
                placeholder="Tìm kiếm địa chỉ"
                className="h-11 !rounded w-full"
                // prefixIcon={<Image src={SearchIcon} alt="" />}
                wrapClassName="w-full !rounded bg-white"
                onSelect={(value) => {
                  setTempKeyword(places?.data?.find((item) => item.ref_id === value)?.display);
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
                value={getValues("wardId")}
                className=" h-11 !rounded"
                placeholder="Chọn phường/xã"
                showSearch={true}
              />
              <InputError error={errors.wardId?.message} />
            </div>
            <div>
              <Label infoText="" label="Tọa độ" />
              <CustomInput
                placeholder="Nhập tọa độ"
                className="h-11"
                onChange={(e) => {
                  setValue("point", e, { shouldValidate: true });
                }}
                value={getValues("point")}
              />
            </div>

            <div className="col-span-2">
              <Label infoText="" label="Trạng thái" />
              <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
                <CustomRadio
                  options={[
                    { value: ECustomerStatus.active, label: "Hoạt động" },
                    {
                      value: ECustomerStatus.inactive,
                      label: "Ngưng hoạt động",
                    },
                    {
                      value: ECustomerStatus.potential,
                      label: "Tiềm năng",
                    },
                  ]}
                  value={getValues("status")}
                  onChange={(value) => setValue("status", value, { shouldValidate: true })}
                />
                <InputError error={errors.status?.message} />
              </div>
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
            <InputError error={errors.note?.message} />
          </div>
        </div>

        <div
          className="flex h-fit w-1/3 max-w-[360px] flex-col bg-white p-5"
          style={{
            boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Ảnh khách hàng</div>
            <CustomUpload
              onChangeValue={(value) => setValue("avatarId", value, { shouldValidate: true })}
              values={[customerDetail?.data?.avatar?.path]}
            >
              <div
                className={
                  "flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5"
                }
              >
                <Image src={PhotographIcon} alt="" />
                <div className="font-semibold">
                  <span className="text-[#E03]">Tải ảnh lên</span>{" "}
                  <span className="text-[#6F727A]">hoặc kéo và thả</span>
                </div>
                <div className="font-thin text-[#6F727A]">PNG, JPG, GIF up to 2MB</div>
              </div>
            </CustomUpload>
          </div>
        </div>
      </div>

      <AddGroupCustomerModal
        isOpen={openAddGroupCustomerModal}
        onCancel={() => {
          setOpenAddGroupCustomerModal(false);
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
    </>
  );
}
