import type { MenuProps } from "antd";
import { Button, Dropdown, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

import ArrowDown from "@/assets/arrowDown.svg";
import DocumentDownload from "@/assets/documentDownload.svg";
import DocumentUpload from "@/assets/documentUpload.svg";
import PlusIconWhite from "@/assets/PlusIconWhite.svg";
import { CustomButton } from "@/components/CustomButton";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import {
  getProductExample,
  getProductExampleKiot,
  getProductExcel,
  getSupplierExcel,
} from "@/api/export.service";
import { useRef, useState } from "react";
import { uploadProductExcel } from "@/api/import.service";
import { ImportFileModal } from "./ImportFileModal";

const ActionFile = ({ data }: any) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const branchId = useRecoilValue(branchState);

  async function downloadExcel() {
    try {
      const response = await getSupplierExcel({ branchId });

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "partners.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  }

  return (
    <>
      <div className="flex w-full items-center justify-end py-3">
        <Button
          type="text"
          className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={downloadExcel}
        >
          <Image src={DocumentUpload} alt="" />
          <span className="pl-[6px]">Xuất file</span>
        </Button>
        <div className="mx-2 h-5 w-[1px] bg-[#D3D5D7]"></div>

        <Button
          type="text"
          className="mr-4 flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={() => setIsOpenModal(true)}
        >
          <Image src={DocumentDownload} alt="" />
          <span className="pl-[6px]">Nhập file</span>
        </Button>
      </div>
      <ImportFileModal
        isOpen={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </>
  );
};

export default ActionFile;
