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
import { getProductExample, getProductExampleKiot, getProductExcel } from "@/api/export.service";
import { useRef, useState } from "react";
import { uploadProductExcel } from "@/api/import.service";
import { ImportFileProductModal } from "./ImportFileProductModal";

const AddNew = () => {
  const router = useRouter();
  const profile = useRecoilValue(profileState);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
  };

  const items: MenuProps["items"] = [
    {
      label: "Thêm mới thuốc",
      key: "1",
      onClick: () => router.push("/products/list/add-medicine"),
    },
    {
      label: "Thêm mới hàng hóa",
      key: "2",
      onClick: () => router.push("/products/list/add-package"),
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} trigger={["click"]}>
      {hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.create) ? (
        <CustomButton onClick={handleButtonClick} type="danger" className="p-0">
          <div className="flex items-center justify-center border-r border-[#EE6274] py-[8px] px-4">
            <Image src={PlusIconWhite} alt="" />
            <span className="pl-[6px]">Thêm mới</span>
          </div>
          <div className="flex items-center px-[10px] py-2">
            <Image src={ArrowDown} alt="" />
          </div>
        </CustomButton>
      ) : (
        <div></div>
      )}
    </Dropdown>
  );
};

const Header = ({ data }: any) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const branchId = useRecoilValue(branchState);

  async function downloadDoctorExcel() {
    try {
      const response = await getProductExcel({ branchId });

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "product_data.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  }
  async function downloadExamExcel() {
    try {
      const response = await getProductExample();

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "product_exam.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error(error?.message);
    }
  }
  async function downloadExamExcelKiot() {
    try {
      const response = await getProductExampleKiot();

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "product_kiot_exam.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error(error?.message);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <Button
          type="text"
          className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={downloadExamExcel}
        >
          <Image src={DocumentUpload} alt="" />
          <span className="pl-[6px]">Xuất file mẫu hệ thống</span>
        </Button>
      ),
    },
    {
      key: "1",
      label: (
        <Button
          type="text"
          className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={downloadExamExcelKiot}
        >
          <Image src={DocumentUpload} alt="" />
          <span className="pl-[6px]">Xuất file mẫu KiotViet</span>
        </Button>
      ),
    },
  ];
  return (
    <>
      <div className="flex w-full items-center justify-end py-3">
        <Button
          type="text"
          className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={downloadDoctorExcel}
        >
          <Image src={DocumentUpload} alt="" />
          <span className="pl-[6px]">Xuất file</span>
        </Button>
        <div className="mx-2 h-5 w-[1px] bg-[#D3D5D7]"></div>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button type="text" className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main">
            <Image src={DocumentUpload} alt="" />
            <span className="pl-[6px]">Xuất file mẫu</span>
          </Button>
        </Dropdown>

        <div className="mx-2 h-5 w-[1px] bg-[#D3D5D7]"></div>

        <Button
          type="text"
          className="mr-4 flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
          onClick={() => setIsOpenModal(true)}
        >
          <Image src={DocumentDownload} alt="" />
          <span className="pl-[6px]">Nhập file</span>
        </Button>
        <AddNew />
      </div>
      <ImportFileProductModal
        isOpen={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </>
  );
};

export { AddNew };

export default Header;
