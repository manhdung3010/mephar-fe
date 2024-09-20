import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { getStore, updateStore } from "@/api/store.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomUpload } from "@/components/CustomUpload";
import NormalUpload from "@/components/CustomUpload/NormalUpload";
import InputError from "@/components/InputError";
import { formatDate } from "@/helpers";
import { useAddress } from "@/hooks/useAddress";

import { schema } from "./schema";

export function StoreInfo() {
  const queryClient = useQueryClient();

  const { data: stores } = useQuery(["SETTING_STORE"], () => getStore());

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (stores) {
      Object.entries(stores?.data?.items[0]).forEach(([name, value]: any) => {
        if (Object.keys(schema.fields).includes(name)) {
          setValue(name, value, { shouldValidate: true });
        }
      });
      setValue(
        "businessRegistrationImageId",
        stores?.data?.items[0]?.businessRegistrationImage?.id
      );
    }
  }, [stores]);

  const { provinces, districts, wards } = useAddress(
    getValues("provinceId"),
    getValues("districtId")
  );

  const { mutate: mutateUpdateStore, isLoading: isLoadingUpdateStore } =
    useMutation(() => updateStore(stores?.data?.items[0]?.id, getValues()), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["SETTING_STORE"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateUpdateStore();
  };

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">THÔNG TIN CỬA HÀNG</div>
        <div className="flex gap-4">
          <CustomButton
            type="danger"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoadingUpdateStore}
          >
            Cập nhật
          </CustomButton>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium text-[#999]">
        Thông tin cửa hàng
      </h2>

      <div className="mb-6 bg-white p-5">
        <div className="mb-5">
          <Label infoText="" label="Tên cửa hàng" required />
          <CustomInput
            className="h-11"
            value={getValues("name")}
            onChange={(e) => setValue("name", e, { shouldValidate: true })}
          />
          <InputError error={errors.name?.message} />
        </div>

        {/* <div className="mb-5">
          <Label infoText="" label="Địa chỉ email" required />
          <CustomInput
            className="h-11"
            value={getValues('email')}
            onChange={(e) => setValue('email', e, { shouldValidate: true })}
          />
          <InputError error={errors.email?.message} />
        </div> */}

        <div className="">
          <Label infoText="" label="Số điện thoại" required />
          <CustomInput
            className="h-11"
            value={getValues("phone")}
            onChange={(e) => setValue("phone", e, { shouldValidate: true })}
          />
          <InputError error={errors.phone?.message} />
        </div>

        <div className="">
          <Label infoText="" label="Số đăng ký kinh doanh" required />
          <CustomInput
            className="h-11"
            value={getValues("businessRegistrationNumber")}
            onChange={(e) =>
              setValue("businessRegistrationNumber", e, {
                shouldValidate: true,
              })
            }
          />
          <InputError error={errors.businessRegistrationNumber?.message} />
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium text-[#999]">Địa chỉ cửa hàng</h2>

      <div className="mb-6 bg-white p-5">
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className="">
            <Label infoText="" label="Tỉnh/Thành phố" required />
            <CustomSelect
              className="h-11 !rounded"
              onChange={(value) => {
                setValue("provinceId", value, { shouldValidate: true });
                setValue("districtId", null as any, { shouldValidate: true });
                setValue("wardId", null as any, { shouldValidate: true });
              }}
              placeholder="Chọn tỉnh/thành phố"
              options={provinces?.data?.items?.map((province) => ({
                value: province.id,
                label: province.name,
              }))}
              showSearch={true}
              value={getValues("provinceId")}
            />
            <InputError error={errors.provinceId?.message} />
          </div>
          <div className="">
            <Label infoText="" label="Quận/Huyện" required />
            <CustomSelect
              className="h-11 !rounded"
              onChange={(value) => {
                setValue("districtId", value, { shouldValidate: true });
                setValue("wardId", null as any, { shouldValidate: true });
              }}
              placeholder="Chọn quận/huyện"
              options={districts?.data?.items?.map((district) => ({
                value: district.id,
                label: district.name,
              }))}
              value={getValues("districtId")}
              showSearch={true}
            />
            <InputError error={errors.districtId?.message} />
          </div>
        </div>

        <div className="mb-6">
          <Label infoText="" label="Phường/Xã" required />
          <CustomSelect
            className="h-11 !rounded"
            onChange={(value) => {
              setValue("wardId", value, { shouldValidate: true });
            }}
            placeholder="Phường/Xã"
            options={wards?.data?.items?.map((ward) => ({
              value: ward.id,
              label: ward.name,
            }))}
            value={getValues("wardId")}
            showSearch={true}
          />
          <InputError error={errors.wardId?.message} />
        </div>

        <div className="mb-5">
          <Label infoText="" label="Địa chỉ" required />
          <CustomInput
            className="h-11"
            value={getValues("address")}
            onChange={(value) =>
              setValue("address", value, { shouldValidate: true })
            }
          />
        </div>
        <InputError error={errors.address?.message} />
      </div>

      <h2 className="mb-4 text-xl font-medium text-[#999]">
        Thông tin tài khoản
      </h2>

      <div className="bg-white p-5">
        <div className="mb-5 font-medium text-[#15171A]">
          Ngày tạo: {formatDate(stores?.data?.items[0]?.createdAt)}
        </div>
        <div className="mb-5 font-medium text-[#15171A]">Ngày hết hạn:</div>
        <div className="mb-2 font-medium text-[#15171A]">Logo cửa hàng:</div>

        <CustomUpload
          className="!w-fit"
          onChangeValue={(value) =>
            setValue("logoId", value, { shouldValidate: true })
          }
          values={[stores?.data?.items[0]?.logo?.path]}
        >
          <NormalUpload className="h-[300px] w-[300px]" />
        </CustomUpload>
      </div>
    </div>
  );
}
