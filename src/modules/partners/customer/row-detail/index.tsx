import classNames from "classnames";
import { useState } from "react";

import type { ICustomer } from "../type";
import { BuyHistory } from "./BuyHistory";
import { CollectPointHistory } from "./CollectPointHistory";
import { Debt } from "./Debt";
import { Info } from "./Info";
import { Note } from "./Note";
import { ReceiveAddress } from "./ReceiveAddress";
import { ReturnHistory } from "./ReturnHistory";
import { PointHistory } from "./PointHistory";
import TripHistory from "./TripHistory";
import PaymentHistory from "./PaymentHistory";
import { hasPermission } from "@/helpers";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

const RowDetail = ({ record, branchId }: { record: ICustomer; branchId: number }) => {
  const [select, setSelect] = useState(0);
  const profile = useRecoilValue(profileState);

  const menu = [
    "Thông tin",
    "Nợ cần thu từ khách",
    "Lịch sử  mua hàng",
    // 'Lịch sử trả hàng',
    "Lịch sử thanh toán",
  ];

  return (
    <div
      className="flex flex-col gap-5 bg-white px-4 pt-4 pb-5"
      style={{ boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)" }}
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          {menu.map((item, index) => (
            <div
              key={index}
              className={classNames(
                "cursor-pointer px-5 py-[6px] rounded-t-lg",
                index === select ? "bg-[#D64457] text-[white]" : "text-black-main",
              )}
              onClick={() => setSelect(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="h-[1px] w-full bg-[#D64457]" />
      </div>
      {select === 0 && <Info record={record} />}
      {/* {select === 1 && <ReceiveAddress record={record} />} */}
      {select === 1 && <Debt record={record} branchId={branchId} />}
      {select === 2 && <BuyHistory record={record} branchId={branchId} />}
      {select === 3 && <PointHistory record={record} branchId={branchId} />}
      {/* {select === 4 && <ReturnHistory record={record} />} */}
      {/* {select === 5 && <CollectPointHistory record={record} />} */}
      {select === 4 && <Note record={record} />}
      {select === 5 && <PaymentHistory id={record?.id} />}
      {select === 6 && <TripHistory id={record?.id} />}
    </div>
  );
};

export default RowDetail;
