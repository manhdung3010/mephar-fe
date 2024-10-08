import { Input } from "antd";

import { formatDateTime, formatMoney, getImage } from "@/helpers";
import Image from "next/image";

const { TextArea } = Input;

export function Info({ record }: { record: any }) {
  return (
    <div className="gap-12 grid grid-cols-12">
      <div className="col-span-2">
        {record?.agency?.logo && (
          <Image
            width={180}
            height={180}
            className="rounded"
            src={getImage(record?.agency?.logo?.path)}
            alt=""
            objectFit="cover"
          />
        )}
      </div>
      <div className="col-span-10">
        <div className="mb-4 grid grid-cols-2 border-b border-[#E8EAEB]">
          <div>
            <div className="mb-4 font-semibold text-black-main">Thông tin người dùng</div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Họ và tên:</div>
              <div className="col-span-2 text-black-main">{record.agency?.users[0]?.fullName}</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Số điện thoại:</div>
              <div className="col-span-2 text-black-main">{record.agency?.users[0]?.phone}</div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Email:</div>
              <div className="col-span-2 text-black-main">{record.agency?.users[0]?.email}</div>
            </div>
          </div>
          <div>
            <div className="mb-4 font-semibold text-black-main">Thông tin cửa hàng</div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Tên cửa hàng:</div>
              <div className="col-span-2 text-black-main">{record?.agency?.name}</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Số điện thoại:</div>
              <div className="col-span-2 text-black-main">{record?.agency?.phone}</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Số đăng ký kinh doanh:</div>
              <div className="col-span-2 text-black-main">{record?.agency?.businessRegistrationNumber}</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-5">
              <div className="text-gray-main ">Địa chỉ:</div>
              <div className="col-span-2 text-black-main">
                {record?.agency?.address}, {record?.agency?.ward?.name}, {record?.agency?.district?.name},{" "}
                {record?.agency?.province?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
