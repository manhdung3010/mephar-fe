import { Input } from "antd";
import Image from "next/image";

import DeleteIcon from "@/assets/deleteRed.svg";
import { CustomButton } from "@/components/CustomButton";
import { formatDate, formatDateTime, hasPermission } from "@/helpers";
import cx from "classnames";
import { EDiscountStatus, EDiscountStatusLabel } from "@/enums";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "../../role/role.enum";
import CopyBlueIcon from "@/assets/copyBlue.svg";
import { useRouter } from "next/router";

export function Info({ record }: { record: any }) {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  return (
    <div className="gap-12 ">
      <div className="mb-4 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Mã chương trình:</div>
          <div className="text-black-main">{record?.code}</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Tên chương trình:</div>
          <div className="text-black-main">{record?.name}</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Thời gian:</div>
          <div className="text-black-main">
            {formatDate(record?.discountTime[0]?.dateFrom) + " - " + formatDate(record?.discountTime[0]?.dateTo)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Trạng thái:</div>
          <div className={cx(record?.status === EDiscountStatus.active ? "text-[#00B63E]" : "text-[#6D6D6D]", "w-max")}>
            {record?.status === EDiscountStatus.active ? EDiscountStatusLabel.active : EDiscountStatusLabel.inactive}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo tháng:</div>
          <div className="text-black-main">
            {record?.discountTime[0].byMonth
              ?.split("//")
              .filter((element) => element !== "")
              .join()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Ghi chú:</div>
          <div className="text-black-main">{record?.note}</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo ngày:</div>
          <div className="text-black-main">
            {record?.discountTime[0].byDay
              ?.split("//")
              .filter((element) => element !== "")
              .join()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5"></div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo thứ:</div>
          <div className="text-black-main">
            {record?.discountTime[0].byWeekDay
              ?.split("//")
              .filter((element) => element !== "")
              .join()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5"></div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 text-gray-main">Theo giờ:</div>
          <div className="text-black-main">
            {record?.discountTime[0].byHour
              ?.split("//")
              .filter((element) => element !== "")
              .join()}
          </div>
        </div>
      </div>
    </div>
  );
}
