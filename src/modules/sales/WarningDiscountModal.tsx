import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { formatNumber } from "@/helpers";
import React from "react";

export default function WarningDiscountModal({
  isOpen,
  onCancel,
  onSave,
  count,
  type = "order",
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  count: number;
  type?: string;
}) {
  return (
    <CustomModal width={600} isOpen={isOpen} onCancel={onCancel} title="Khuyến mại" footer={null}>
      <div>
        <p>Khách hàng này đã từng được áp dụng các chương trình khuyến mãi sau:</p>
        <p>
          - Khuyến mại {type === "order" ? "hóa đơn" : "hàng hóa"}:{" "}
          <span className="text-red-main">{formatNumber(count ?? 0)}</span> lần?
        </p>
        <p>Bạn có muốn áp dụng tiếp các chương trình khuyến mại đó không?</p>
      </div>
      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton outline={true} className="h-[46px] min-w-[150px] py-2 px-4" onClick={onCancel}>
          Bỏ qua
        </CustomButton>
        <CustomButton className="h-[46px] min-w-[150px] py-2 px-4" onClick={onSave}>
          Đồng ý
        </CustomButton>
      </div>
    </CustomModal>
  );
}
