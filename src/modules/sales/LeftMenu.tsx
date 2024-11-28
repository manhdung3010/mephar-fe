import Image from "next/image";
import { useResetRecoilState } from "recoil";

import Clear from "@/assets/clearIcon.svg";
import CollectPoint from "@/assets/collectPointIcon.svg";
import Document from "@/assets/documentIcon.svg";
import Gift from "@/assets/giftIcon.svg";
import ListOrder from "@/assets/listOrder.svg";
import PayLoan from "@/assets/payLoan.svg";
import Promotion from "@/assets/promotionIcon.svg";
import ReturnOrder from "@/assets/switchIcon.svg";
import User from "@/assets/userIcon.svg";
import { orderActiveState, orderState, productImportState } from "@/recoil/state";

import { useEffect, useState } from "react";
import CustomerModal from "./customer-modal";
import Invoice from "./invoice";
import InvoiceModal from "./return-product/InvoiceModal";
import { LeftMenuStyled } from "./styled";
import ReportModal from "./report";
import { useRouter } from "next/router";
import PointModal from "../settings/point-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../settings/point-modal/schema";
import DiscountModal from "./discount-modal";
import CustomerDebtModal from "./customer-debt";

export function LeftMenu() {
  const router = useRouter();
  const { isReturn } = router.query;

  const [openPointModal, setOpenPointModal] = useState(false);

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

  const resetOrderObject = useResetRecoilState(orderState);
  const resetOrderActive = useResetRecoilState(orderActiveState);
  const resetProductsImport = useResetRecoilState(productImportState);

  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);
  const [openCustomerDebt, setCustomerDebt] = useState(false);

  useEffect(() => {
    if (isReturn) {
      setOpenInvoiceModal(true);
    }
  }, [isReturn]);

  const clearCache = () => {
    resetOrderObject();
    resetOrderActive();
    resetProductsImport();
  };
  return (
    <LeftMenuStyled className="h-[calc(100vh-78px)] w-[125px] min-w-[125px] overflow-y-auto py-5 px-4">
      <div>
        <div
          onClick={() => setOpenDiscount(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={Promotion} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Khuyến mại</div>
        </div>

        {/* <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={Gift} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Đổi quà
          </div>
        </div> */}

        <div
          onClick={() => setOpenPointModal(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={CollectPoint} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Tích điểm</div>
        </div>

        <div
          onClick={() => setOpenCustomer(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={User} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Thông tin khách hàng</div>
        </div>

        <div
          onClick={() => setOpenInvoiceModal(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={ReturnOrder} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Đổi trả đơn hàng</div>
        </div>

        <div
          onClick={() => setCustomerDebt(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={PayLoan} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Khách trả nợ</div>
        </div>

        <div
          onClick={() => setOpenInvoice(true)}
          className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2 cursor-pointer"
        >
          <Image src={ListOrder} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">Danh sách đơn hàng</div>
        </div>
      </div>

      <InvoiceModal isOpen={!!openInvoiceModal} onCancel={() => setOpenInvoiceModal(false)} />
      <Invoice isOpen={!!openInvoice} onCancel={() => setOpenInvoice(false)} />
      <CustomerModal isOpen={!!openCustomer} onCancel={() => setOpenCustomer(false)} />
      <ReportModal isOpen={!!openReport} onCancel={() => setOpenReport(false)} />
      <DiscountModal isOpen={!!openDiscount} onCancel={() => setOpenDiscount(false)} />
      <PointModal
        isOpen={openPointModal}
        onCancel={() => setOpenPointModal(false)}
        getValues={getValues}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
      />
      {/* Customer debt */}
      <CustomerDebtModal isOpen={openCustomerDebt} onCancel={() => setCustomerDebt(false)} />
    </LeftMenuStyled>
  );
}
