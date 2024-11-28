import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import DeliveryIcon from "@/assets/deliveryRedIcon.svg";
import DiscountIcon from "@/assets/discountRedIcon.svg";
import EmployeeIcon from "@/assets/employeeRedIcon.svg";
import LocationIcon from "@/assets/locationRedIcon.svg";
import MedicineIcon from "@/assets/medicineRedIcon.svg";
import RoleIcon from "@/assets/roleRedIcon.svg";
import StarIcon from "@/assets/starRedIcon.svg";
import StoreIcon from "@/assets/storeRedIcon.svg";
import { hasPermission } from "@/helpers";
import { profileState } from "@/recoil/state";

import { RoleModel } from "./role/role.enum";
import { useEffect, useState } from "react";
import PointModal from "./point-modal";
import { Switch } from "antd";
import { CustomSwitch } from "@/components/CustomSwitch";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./point-modal/schema";
import { getPointStatus, updatePointStatus } from "@/api/point.service";
import { useQuery } from "@tanstack/react-query";

export function Settings() {
  const router = useRouter();
  const [openPointModal, setOpenPointModal] = useState(false);
  const profile = useRecoilValue(profileState);

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

  const { data: pointStatus, isLoading: isLoadingPointDetail } = useQuery(["POINT_STATUS", openPointModal], () =>
    getPointStatus(),
  );

  useEffect(() => {
    if (pointStatus?.data?.status === "active") {
      setValue("status", pointStatus?.data?.status, { shouldValidate: true });
      setValue("type", pointStatus?.data?.type, { shouldValidate: true });
    } else {
      setValue("status", "inactive", { shouldValidate: true });
      setValue("type", "order", { shouldValidate: true });
    }
  }, [pointStatus]);

  return (
    <div className="mt-6 bg-white p-5">
      <h2 className="mb-5 text-xl font-medium text-[#182537]">Thiết lập cửa hàng</h2>

      <div className=" grid grid-cols-3 gap-6">
        {hasPermission(profile?.role?.permissions, RoleModel.store) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push("/settings/store")}
          >
            <Image src={StoreIcon} />
            <div>
              <div className=" mb-1 font-semibold">Thông tin cửa hàng</div>
              <div className="text-[#666] ">Quản lý thông tin liên hệ và địa chỉ của cửa hàng</div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.branch) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push("/settings/branch")}
          >
            <Image src={LocationIcon} />
            <div>
              <div className=" mb-1 font-semibold">Quản lý chi nhánh</div>
              <div className="text-[#666] ">Thêm mới và quản lý thông tin chi nhánh</div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.employee) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push("/settings/employee")}
          >
            <Image src={EmployeeIcon} />
            <div>
              <div className=" mb-1 font-semibold">Quản lý nhân viên</div>
              <div className="text-[#666] ">Thêm mới và quản lý danh sách nhân viên</div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.role) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push("/settings/role")}
          >
            <Image src={RoleIcon} />
            <div>
              <div className=" mb-1 font-semibold">Phân quyền vai trò</div>
              <div className="text-[#666] ">Quản lý và phân quyền tài khoản nhân viên</div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.discount) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push("/settings/discount")}
          >
            <Image src={DiscountIcon} />
            <div>
              <div className=" mb-1 font-semibold">Khuyến mại</div>
              <div className="text-[#666] ">Thêm mới và quản lý chương trình khuyến mại</div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.point_setting) && (
          <div className="flex items-center justify-between gap-4 rounded bg-[#F2F9FF] p-5">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setOpenPointModal(true)}>
              <Image src={StarIcon} />
              <div>
                <div className=" mb-1 font-semibold">Thiết lập điểm</div>
                <div className="text-[#666] ">Thiết lập tích điểm khi mua hàng</div>
              </div>
            </div>
            <div>
              <CustomSwitch
                checked={getValues("status") === "active"}
                onChange={() => {
                  if (getValues("status") === "inactive") {
                    setOpenPointModal(true);
                  } else {
                    updatePointStatus()
                      .then(() => {
                        setValue("status", getValues("status") === "active" ? "inactive" : "active", {
                          shouldValidate: true,
                        });
                      })
                      .catch(() => {
                        console.log("error");
                      });
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      <PointModal
        isOpen={openPointModal}
        onCancel={() => setOpenPointModal(false)}
        getValues={getValues}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
      />
    </div>
  );
}
