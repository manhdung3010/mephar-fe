import { useQuery } from "@tanstack/react-query";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Space } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { getBranch } from "@/api/branch.service";
import DropdownIcon from "@/assets/dropdownIcon.svg";
import LocationIcon from "@/assets/locationIcon.svg";
import { getImage, randomString } from "@/helpers";
import { setItem, setToken } from "@/helpers/storage";
import { agencyState, branchState, orderActiveState, orderState, profileState } from "@/recoil/state";
import { EStorageKey } from "@/enums";
import _ from "lodash";
export const generalId = "GENERAL_ID";

export const Header = ({ title }: { title?: string | ReactNode }) => {
  const router = useRouter();
  const routerList = ["/", "/reports/sale-report"];

  const profile = useRecoilValue(profileState);
  const [branch, setBranch] = useRecoilState(branchState);
  const [listBranch, setListBranch] = useState<any>([]);
  const [isAgency, setIsAgency] = useRecoilState(agencyState);
  const [, setOrderObject] = useRecoilState(orderState);
  const [, setOrderActive] = useRecoilState(orderActiveState);

  const { data: branches } = useQuery(["SETTING_BRANCH_HEADER"], () => getBranch());

  useEffect(() => {
    if (branches?.data?.items?.length) {
      // filter isGeneral = true
      const generalBranch = {
        id: generalId,
        name: "Tất cả chi nhánh",
        isGeneral: true,
      };
      // sort by isGeneral is the last
      const sortedBranches = branches.data.items;
      if (sortedBranches.length > 1) {
        sortedBranches.push(generalBranch);
      }
      setListBranch(sortedBranches);
    }
  }, [branches]);
  useEffect(() => {
    const isGeneral = listBranch?.find((item) => item.isGeneral);
    if (!routerList.includes(router.pathname)) {
      if (branch === isGeneral?.id) {
        const defaultBrach = listBranch?.find((item) => item.isDefaultBranch);
        if (defaultBrach) {
          setBranch(defaultBrach.id);
        } else {
          setBranch(listBranch[0]?.id);
        }
      } else {
        setBranch(branch);
      }
    }
  }, [router.pathname, listBranch]);

  const items: MenuProps["items"] = listBranch?.map((item) => ({
    key: item.id,
    label: (
      <span
        onClick={() => {
          if (item.isGeneral && !routerList.includes(router.pathname)) {
            return;
          }
          const key = randomString();
          setBranch(item.id);
          setIsAgency(item.isAgency);
          setOrderObject({ [key]: [] });
          setOrderActive(key);
        }}
      >
        {item.name}
      </span>
    ),
    disabled: item.isGeneral && !routerList.includes(router.pathname),
  }));

  const logout = () => {
    // setToken("");
    // setItem(EStorageKey.PRODUCT_RETURN_STATE, "");
    // setItem(EStorageKey.PRODUCT_IMPORT_STATE, "");
    // setItem(EStorageKey.PRODUCT_MOVE_STATE, "");
    // setItem(EStorageKey.ORDER_ACTIVE_STATE, "");
    // setItem(EStorageKey.CHECK_INVENTORY_STATE, "");
    // setItem(EStorageKey.MARKET_ORDER_STATE, "");
    // setItem(EStorageKey.PRODUCT_RECEIVE_STATE, "");
    // setItem(EStorageKey.MARKET_CART_STATE, "");
    localStorage.clear();
    router.push("/auth/sign-in");
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "logout",
      label: <span onClick={logout}>Đăng xuất</span>,
    },
  ];

  return (
    <div className="flex h-[52px] w-full items-center justify-between px-8 shadow-[0px_2px_4px_0px_rgba(168,168,168,0.25)]">
      <div className="text-2xl ">{title}</div>

      <div className="flex">
        <Dropdown menu={{ items }}>
          <Space>
            <div className="flex items-center">
              <Image src={LocationIcon} />
              <span className=" mx-2 cursor-pointer">
                {branches?.data?.items?.find((item) => item.id === branch)?.name || "Tất cả chi nhánh"}
              </span>
              <Image src={DropdownIcon} />
            </div>
          </Space>
        </Dropdown>

        <div className="ml-5">
          {profile?.avatar?.path ? (
            <Avatar style={{ background: "#4285F4" }} src={getImage(profile?.avatar?.path)} size={32}></Avatar>
          ) : (
            <Avatar style={{ background: "#4285F4" }} size={32}>
              {profile?.username[0]}
            </Avatar>
          )}

          <Dropdown menu={{ items: profileItems }}>
            <Space>
              <div className="flex items-center">
                <span className=" mx-2 cursor-pointer">{profile?.fullName}</span>
                <Image className=" cursor-pointer" src={DropdownIcon} />
              </div>
            </Space>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
