import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { schema } from "./schema";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import { useAddress } from "@/hooks/useAddress";
import { CustomSwitch } from "@/components/CustomSwitch";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShipAddress, getShipAddressDetail, updateShipAddress } from "@/api/market.service";

function AddAddressModal({
  isOpen,
  onCancel,
  addressId = "",
  newBranchId,
  newCustomerId,
}: {
  isOpen: boolean;
  onCancel: any;
  addressId: string;
  newBranchId?: string; // thêm mới địa chỉ cho cửa hàng khác
  newCustomerId?: string; // thêm mới địa chỉ cho khách hàng khác
}) {
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      isDefaultAddress: false,
    },
  });
  const profile = useRecoilValue(profileState);
  const branchId = useRecoilValue(branchState);
  const queryClient = useQueryClient();
  const { mutate: mutateCreateAddress, isLoading } = useMutation(
    () => {
      const payload = {
        ...getValues(),
        ...(newBranchId && { toStoreId: newBranchId }),
        ...(newCustomerId && { customerId: newCustomerId }),
      };
      if (addressId) {
        return updateShipAddress(addressId, payload);
      }
      return createShipAddress(payload);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["SHIP_ADDRESS"]);
        // reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const { data: addressDetail, isLoading: isLoadingDetail } = useQuery(
    ["MARKET_PRODUCT_DETAIL", JSON.stringify(addressId)],
    () => getShipAddressDetail(String(addressId), { storeId: newBranchId || null }),
    {
      enabled: !!addressId,
    },
  );

  useEffect(() => {
    if (!addressId) {
      reset();
    }
  }, [addressId]);

  useEffect(() => {
    if (addressDetail) {
      const addressData = addressDetail?.data?.item;
      setValue("fullName", addressData?.fullName, { shouldValidate: true });
      setValue("phone", addressData?.phone, { shouldValidate: true });
      setValue("provinceId", addressData?.provinceId, { shouldValidate: true });
      setValue("districtId", addressData?.districtId, { shouldValidate: true });
      setValue("wardId", addressData?.wardId, { shouldValidate: true });
      setValue("address", addressData?.address, { shouldValidate: true });
      setValue("isDefaultAddress", addressData?.isDefaultAddress, {
        shouldValidate: true,
      });
    }
  }, [addressDetail]);

  const { provinces, districts, wards } = useAddress(getValues("provinceId"), getValues("districtId"));

  const onSubmit = () => {
    mutateCreateAddress();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`${addressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}`}
      width={900}
      customFooter={true}
    >
      <div className="my-6">
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomInput
            placeholder="Họ tên"
            className="border-0 py-2"
            value={getValues("fullName")}
            onChange={(value) => setValue("fullName", value, { shouldValidate: true })}
          />
          <InputError error={errors.fullName?.message} />
        </div>
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomInput
            placeholder="Số điện thoại"
            className="border-0 py-2"
            value={getValues("phone")}
            onChange={(value) => setValue("phone", value, { shouldValidate: true })}
          />
          <InputError error={errors.phone?.message} />
        </div>
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomSelect
            onChange={(value) => setValue("provinceId", value, { shouldValidate: true })}
            options={provinces?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("provinceId")}
            className=" !rounded !border-0"
            placeholder="Chọn tỉnh/thành"
            showSearch={true}
          />
          <InputError error={errors.provinceId?.message} />
        </div>
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomSelect
            onChange={(value) => setValue("districtId", value, { shouldValidate: true })}
            options={districts?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("districtId")}
            className=" !rounded !border-0"
            placeholder="Chọn quận/huyện"
            showSearch={true}
          />
          <InputError error={errors.districtId?.message} />
        </div>
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomSelect
            onChange={(value) => setValue("wardId", value, { shouldValidate: true })}
            options={wards?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={getValues("wardId")}
            className=" !rounded !border-0"
            placeholder="Chọn phường/xã"
            showSearch={true}
          />
          <InputError error={errors.wardId?.message} />
        </div>
        <div className="border-b-[1px] border-[#EBEBF0] py-2">
          <CustomInput
            placeholder="Địa chỉ chi tiết"
            className="border-0 py-2"
            value={getValues("address")}
            onChange={(value) => setValue("address", value, { shouldValidate: true })}
          />
        </div>
        <div className="flex justify-between items-center mt-8">
          <p>Đặt làm địa chỉ mặc định</p>
          <CustomSwitch
            value={getValues("isDefaultAddress")}
            onChange={() =>
              setValue("isDefaultAddress", !getValues("isDefaultAddress"), {
                shouldValidate: true,
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <CustomButton outline type="original" className="!w-[180px] !h-11" onClick={onCancel}>
          Hủy
        </CustomButton>
        <CustomButton className="!w-[180px] !h-11" onClick={handleSubmit(onSubmit)}>
          Lưu{" "}
        </CustomButton>
      </div>
    </CustomModal>
  );
}

export default AddAddressModal;
