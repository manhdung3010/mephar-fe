import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createDoctor,
  getDoctorDetail,
  getLevel,
  getMajor,
  getWorkPlace,
  updateDoctor,
} from "@/api/doctor.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import PhotographIcon from "@/assets/photograph.svg";
import PlusIcon from "@/assets/plus-circle.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomUpload } from "@/components/CustomUpload";
import InputError from "@/components/InputError";
import { EDoctorStatus, EGender } from "@/enums";
import { getImage, hasPermission } from "@/helpers";
import { useAddress } from "@/hooks/useAddress";

import { AddLevelModal } from "./AddLevelModal";
import { AddMajorModal } from "./AddMajorModal";
import { AddWorkPlaceModal } from "./AddWorkPlaceModal";
import { schema } from "./schema";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

export function AddDoctor({ doctorId }: { doctorId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [openMajorModal, setOpenMajorModal] = useState(false);
  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [openWorkPlaceModal, setOpenWorkPlaceModal] = useState(false);

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      gender: EGender.male,
      status: EDoctorStatus.active,
    },
  });

  const { provinces, districts, wards } = useAddress(
    getValues("provinceId"),
    getValues("districtId")
  );

  const [majorKeyword, setMajorKeyword] = useState();
  const [levelKeyword, setLevelKeyword] = useState();
  const [workPlaceKeyword, setWorkPlaceKeyword] = useState();

  const { data: majors } = useQuery(["MAJOR", majorKeyword], () =>
    getMajor({ page: 1, limit: 20, keyword: majorKeyword })
  );

  const { data: levels } = useQuery(["LEVEL", levelKeyword], () =>
    getLevel({ page: 1, limit: 20, keyword: levelKeyword })
  );

  const { data: workPlaces } = useQuery(["WORK_PLACE", workPlaceKeyword], () =>
    getWorkPlace({ page: 1, limit: 20, keyword: workPlaceKeyword })
  );

  const { data: doctorDetail } = useQuery(
    ["DOCTOR_DETAIL", doctorId],
    () => getDoctorDetail(Number(doctorId)),
    { enabled: !!doctorId }
  );

  const { mutate: mutateCreateDoctor, isLoading: isLoadingCreateDoctor } =
    useMutation(
      () =>
        doctorDetail
          ? updateDoctor(Number(doctorDetail.data.id), getValues())
          : createDoctor(getValues()),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["DOCTOR_LIST"]);

          router.push("/partners/doctor");
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateDoctor();
  };

  const profile = useRecoilValue(profileState);
  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.doctor, RoleAction.create)) {
        message.error('Bạn không có quyền truy cập vào trang này');
        router.push('/partners/doctor');
      }
    }
  }, [profile?.role?.permissions]);

  useEffect(() => {
    if (doctorDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(doctorDetail.data[key])) {
          setValue(key, doctorDetail.data[key], { shouldValidate: true });
        }
      });

      setMajorKeyword(doctorDetail?.data?.specialist?.name);
      setLevelKeyword(doctorDetail?.data?.level?.name);
      setWorkPlaceKeyword(doctorDetail?.data?.workPlace?.name);
    }
  }, [doctorDetail]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {doctorDetail ? "Cập nhật bác sĩ" : "Thêm mới Bác sĩ"}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push("/partners/doctor")}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            type="danger"
            disabled={isLoadingCreateDoctor}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
            <div>
              <Label infoText="" label="Mã bác sĩ" />
              <CustomInput
                placeholder="Mã mặc định"
                className="h-11"
                onChange={(e) => setValue("code", e, { shouldValidate: true })}
                value={getValues("code")}
                disabled={doctorDetail ? true : false}
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
              <Label infoText="" label="Tên bác sĩ" required />
              <CustomInput
                placeholder="Nhập tên bác sĩ"
                className="h-11"
                onChange={(e) => setValue("name", e, { shouldValidate: true })}
                value={getValues("name")}
              />
              <InputError error={errors.name?.message} />
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
              <Label infoText="" label="Giới tính" />
              <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
                <CustomRadio
                  options={[
                    { value: EGender.male, label: "Nam" },
                    { value: EGender.female, label: "Nữ" },
                  ]}
                  onChange={(value) =>
                    setValue("gender", value, { shouldValidate: true })
                  }
                  value={getValues("gender")}
                />
              </div>
            </div>

            <div>
              <Label infoText="" label="Chuyên khoa" />
              <CustomSelect
                onChange={(value) =>
                  setValue("specialistId", value, { shouldValidate: true })
                }
                options={majors?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues("specialistId")}
                showSearch={true}
                onSearch={debounce((value) => {
                  setMajorKeyword(value);
                }, 300)}
                className=" h-11 !rounded"
                placeholder="Chọn chuyên khoa"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} />
                    <Image
                      src={PlusIcon}
                      onClick={() => setOpenMajorModal(true)}
                    />
                  </div>
                }
              />
            </div>

            <div>
              <Label infoText="" label="Trình độ" />
              <CustomSelect
                onChange={(value) =>
                  setValue("levelId", value, { shouldValidate: true })
                }
                options={levels?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues("levelId")}
                showSearch={true}
                onSearch={debounce((value) => {
                  setLevelKeyword(value);
                }, 300)}
                className=" h-11 !rounded"
                placeholder="Chọn trình độ"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} />
                    <Image
                      src={PlusIcon}
                      onClick={() => setOpenLevelModal(true)}
                    />
                  </div>
                }
              />
            </div>

            <div>
              <Label infoText="" label="Nơi công tác" />
              <CustomSelect
                onChange={(value) =>
                  setValue("workPlaceId", value, { shouldValidate: true })
                }
                options={workPlaces?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues("workPlaceId")}
                showSearch={true}
                onSearch={debounce((value) => {
                  setWorkPlaceKeyword(value);
                }, 300)}
                className=" h-11 !rounded"
                placeholder="Chọn nơi công tác"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} />
                    <Image
                      src={PlusIcon}
                      onClick={() => setOpenWorkPlaceModal(true)}
                    />
                  </div>
                }
              />
            </div>

            <div>
              <Label infoText="" label="Địa chỉ" />
              <CustomInput
                placeholder="Nhập địa chỉ"
                className="h-11"
                onChange={(e) =>
                  setValue("address", e, { shouldValidate: true })
                }
                value={getValues("address")}
              />
            </div>

            <div>
              <Label infoText="" label="Tỉnh/Thành" />
              <CustomSelect
                onChange={(value) =>
                  setValue("provinceId", value, { shouldValidate: true })
                }
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
                onChange={(value) =>
                  setValue("districtId", value, { shouldValidate: true })
                }
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
                onChange={(value) =>
                  setValue("wardId", value, { shouldValidate: true })
                }
                options={wards?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues("wardId")}
                showSearch={true}
                className=" h-11 !rounded"
                placeholder="Chọn phường/xã"
              />
              <InputError error={errors.wardId?.message} />
            </div>

            <div>
              <Label infoText="" label="Trạng thái" />
              <div className="h-11 rounded-md border border-[#d9d9d9] px-4 py-[2px]">
                <CustomRadio
                  onChange={(value) =>
                    setValue("status", value, { shouldValidate: true })
                  }
                  options={[
                    { value: EDoctorStatus.active, label: "Hoạt động" },
                    { value: EDoctorStatus.inactive, label: "Ngưng hoạt động" },
                  ]}
                  value={getValues("status")}
                />
              </div>
            </div>
          </div>

          <div>
            <Label infoText="" label="Ghi chú" />
            <CustomTextarea
              rows={10}
              placeholder="Nhập ghi chú"
              onChange={(e) =>
                setValue("note", e.target.value, { shouldValidate: true })
              }
              value={getValues("note")}
            />
          </div>
        </div>

        <div
          className="flex h-fit w-1/3 max-w-[360px] flex-col bg-white p-5"
          style={{
            boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Ảnh bác sĩ</div>
            <CustomUpload
              onChangeValue={(value) =>
                setValue("avatarId", value, { shouldValidate: true })
              }
              values={[getImage(doctorDetail?.data?.avatar?.path)]}
              className="mb-5"
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
                <div className="font-thin text-[#6F727A]">
                  PNG, JPG, GIF up to 2MB
                </div>
              </div>
            </CustomUpload>
          </div>
        </div>
      </div>

      <AddMajorModal
        isOpen={openMajorModal}
        onCancel={() => setOpenMajorModal(false)}
        setMajorKeyword={setMajorKeyword}
        setDoctorValue={setValue}
        onSave={({ specialistId, specialistName }) => {
          setMajorKeyword(specialistName);
          setValue("specialistId", specialistId, {
            shouldValidate: true,
          });
        }}
      />

      <AddLevelModal
        isOpen={openLevelModal}
        onCancel={() => setOpenLevelModal(false)}
        setLevelKeyword={setLevelKeyword}
        setDoctorValue={setValue}
        onSave={({ levelId, levelName }) => {
          setMajorKeyword(levelName);
          setValue("levelId", levelId, {
            shouldValidate: true,
          });
        }}
      />

      <AddWorkPlaceModal
        isOpen={openWorkPlaceModal}
        onCancel={() => setOpenWorkPlaceModal(false)}
        setWordPlaceKeyword={setWorkPlaceKeyword}
        setDoctorValue={setValue}
        onSave={({ workPlaceId, workPlaceName }) => {
          setMajorKeyword(workPlaceName);
          setValue("workPlaceId", workPlaceId, {
            shouldValidate: true,
          });
        }}
      />
    </>
  );
}
