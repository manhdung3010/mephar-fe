import Image from "next/image";

import CartIcon from "@/assets/cartIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import SaleInvoicePrint from "./SaleInvoicePrint";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import styles from "./saleInvoice.module.css";
import { on } from "events";

export function OrderSuccessModal({
  isOpen,
  onCancel,
  saleInvoice,
}: {
  isOpen: boolean;
  onCancel: () => void;
  saleInvoice: any;
}) {
  const invoiceComponentRef = useRef(null);

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  const handlePrintSaleInvoice = () => {
    handlePrintInvoice();
    onCancel();
  };

  return (
    <CustomModal width={480} isOpen={isOpen} onCancel={onCancel} footer={null}>
      <div className="flex flex-col justify-center py-4 text-center">
        <div className="mt-10 mb-9">
          <Image src={CartIcon} alt="" />
        </div>

        <div className="mb-10">
          <div className="text-xl font-medium text-[#039F00]">Thanh toán thành công!</div>
        </div>
      </div>

      <div ref={invoiceComponentRef} className={styles.invoicePrint}>
        <SaleInvoicePrint saleInvoice={saleInvoice} />
      </div>
    </CustomModal>
  );
}
