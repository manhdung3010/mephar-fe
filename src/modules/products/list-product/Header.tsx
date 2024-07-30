import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

import ArrowDown from "@/assets/arrowDown.svg";
import DocumentDownload from "@/assets/documentDownload.svg";
import DocumentUpload from "@/assets/documentUpload.svg";
import PlusIconWhite from "@/assets/PlusIconWhite.svg";
import { CustomButton } from "@/components/CustomButton";
import useExportToExcel from "@/hooks/useExportExcel";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

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
    {
      label: "Thêm mới combo - đóng gói",
      key: "3",
      onClick: () => router.push("/products/list/add-combo"),
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} trigger={["click"]}>
      {hasPermission(
        profile?.role?.permissions,
        RoleModel.list_product,
        RoleAction.create
      ) ? (
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
  const columnMapping = {
    code: "Mã hàng",
    name: "Tên sản phẩm",
    shortName: "Tên viết tắt",
    baseUnit: "Đơn vị",
    groupProduct: "Nhóm hàng",
    type: "Loại hàng",
    price: "Giá bán",
    packingSpecification: "Quy cách đóng gói",
    weight: "Trọng lượng",
    productDosage: "Đường dùng",
    productPosition: "Vị trí",
    registerNumber: "Số đăng ký",
    activeElement: "Hoạt chất",
    productManufacture: "Nhà sản xuất",
    country: "Nước sản xuất",
    description: "Mô tả",
    status: "Trạng thái",
  };
  const { exported, exportToExcel } = useExportToExcel(
    data,
    columnMapping,
    `DANHSACHSANPHAM_${Date.now()}.xlsx`
  );

  return (
    <div className="flex w-full items-center justify-end py-3">
      <Button
        type="text"
        className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
        onClick={exportToExcel}
      >
        <Image src={DocumentUpload} alt="" />
        <span className="pl-[6px]">Xuất file</span>
      </Button>
      <div className="mx-2 h-5 w-[1px] bg-[#D3D5D7]"></div>
      <Button
        type="text"
        className="mr-4 flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
      >
        <Image src={DocumentDownload} alt="" />
        <span className="pl-[6px]">Nhập file</span>
      </Button>
      <AddNew />
    </div>
  );
};

export { AddNew };

export default Header;
