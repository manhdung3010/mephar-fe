import { Input } from "antd";
import Image from "next/image";

import BillIcon from "@/assets/billIcon.svg";
import PrintIcon from "@/assets/printOrder.svg";
import { CustomButton } from "@/components/CustomButton";
import { formatDateTime, formatMoney } from "@/helpers";
import { AddCashbookModal } from "../AddCashbookModal";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "./InvoicePrint";
import styles from "./invoicePrint.module.css";

const { TextArea } = Input;

export function Info({ record }: { record: any }) {
  const invoiceComponentRef = useRef(null);
  const [openAddCashbookModal, setOpenAddCashbookModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });
  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div ref={invoiceComponentRef} className={styles.invoicePrint}>
          <InvoicePrint saleInvoice={record} />
        </div>
        <div className="mb-4 grid w-3/4 grid-cols-2 gap-4">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Mã phiếu:</div>
            <div className="text-black-main">{record?.code}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Chi nhánh:</div>
            <div className="text-black-main">{record?.branch?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Thời gian:</div>
            <div className="text-black-main">
              {formatDateTime(record?.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Loại thu chi:</div>
            <div className="text-black-main">
              {record?.typeTransaction?.name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Giá trị:</div>
            <div className="text-black-main">{formatMoney(record?.value)}</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Trạng thái:</div>
            <div className="text-[#00B63E]">Đã hoàn thành</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Người tạo:</div>
            <div className="text-black-main">
              {record?.userCreated?.fullName}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Người nộp:</div>
            <div className="text-black-main">
              {record?.targetCustomer?.fullName ||
                record?.targetBranch?.name ||
                record?.targetOther?.name ||
                record?.targetSupplier?.name || record?.targetUser?.fullName}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Số điện thoại:</div>
            <div className="text-black-main">
              {record?.targetCustomer?.phone ||
                record?.targetBranch?.phone ||
                record?.targetOther?.phone ||
                record?.targetSupplier?.phone || record?.targetUser?.phone}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 text-gray-main">Đối tượng nộp:</div>
            <div className="text-black-main">
              {record?.target === "customer"
                ? "Khách hàng"
                : record?.target === "supplier"
                  ? "Nhà cung cấp"
                  : record?.target === "user"
                    ? "Nhân viên"
                    : "Khác"}
            </div>
          </div>

          {/* // <div className="grid grid-cols-3 gap-5">
          //   <div className="col-span-1 text-gray-main">Địa chỉ:</div>
          //   <div className="text-black-main">---</div>
          // </div> */}
        </div>

        <div className="grow">
          <TextArea rows={8} value={record?.note} placeholder="Ghi chú:" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={BillIcon} alt="" />}
          onClick={() => {
            setOpenAddCashbookModal(true);
            setTransactionId(record?.id);
            setTransactionType(record?.ballotType);
          }}
        >
          Mở phiếu
        </CustomButton>

        <CustomButton
          type="primary"
          outline={true}
          prefixIcon={<Image src={PrintIcon} alt="" />}
          onClick={handlePrintInvoice}
        >
          In sổ
        </CustomButton>
      </div>

      <AddCashbookModal
        isOpen={openAddCashbookModal}
        onCancel={() => {
          setOpenAddCashbookModal(false);
          setTransactionId("");
        }}
        type={transactionType}
        id={transactionId}
      />
    </div>
  );
}
