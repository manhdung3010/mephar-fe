import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

import ArrowDown from "@/assets/arrowDown.svg";
import { CustomButton } from "@/components/CustomButton";

const AddNew = () => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
  };

  const items: MenuProps["items"] = [
    {
      label: "In",
      key: "1",
    },
    {
      label: "Xuất file",
      key: "2",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} trigger={["click"]}>
      <CustomButton onClick={handleButtonClick} type="danger" className="p-0">
        <div className="flex items-center justify-center border-r border-[#EE6274] py-[8px] px-4">
          <span className="pl-[6px]">Thao tác</span>
        </div>
        <div className="flex items-center px-[10px] py-2">
          <Image src={ArrowDown} alt="" />
        </div>
      </CustomButton>
    </Dropdown>
  );
};

const Header = () => {
  return (
    <div>
      <AddNew />
    </div>
  );
};

export { AddNew };

export default Header;
