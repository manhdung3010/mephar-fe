import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getBranch } from '@/api/branch.service';
import DropdownIcon from '@/assets/dropdownIcon.svg';
import LocationIcon from '@/assets/locationIcon.svg';
import { getImage, randomString } from '@/helpers';
import { setItem, setToken } from '@/helpers/storage';
import {
  branchState,
  orderActiveState,
  orderState,
  profileState,
} from '@/recoil/state';
import { EStorageKey } from '@/enums';

export const Header = ({ title }: { title?: string | ReactNode }) => {
  const router = useRouter();

  const profile = useRecoilValue(profileState);
  const [branch, setBranch] = useRecoilState(branchState);
  const [, setOrderObject] = useRecoilState(orderState);
  const [, setOrderActive] = useRecoilState(orderActiveState);

  const { data: branches } = useQuery(['SETTING_BRANCH'], () => getBranch());

  const items: MenuProps['items'] = branches?.data?.items?.map((item) => ({
    key: item.id,
    label: (
      <span
        onClick={() => {
          const key = randomString();
          setBranch(item.id);
          setOrderObject({ [key]: [] });
          setOrderActive(key);
        }}
      >
        {item.name}
      </span>
    ),
  }));

  const logout = () => {
    setToken('');
    setItem(EStorageKey.PRODUCT_RETURN_STATE, '');
    router.push('/auth/sign-in');
  };

  const profileItems: MenuProps['items'] = [
    {
      key: 'logout',
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
                {
                  branches?.data?.items?.find((item) => item.id === branch)
                    ?.name
                }
              </span>
              <Image src={DropdownIcon} />
            </div>
          </Space>
        </Dropdown>

        <div className="ml-5">
          {profile?.avatar?.path ? (
            <Avatar
              style={{ background: '#4285F4' }}
              src={getImage(profile?.avatar?.path)}
              size={32}
            ></Avatar>
          ) : (
            <Avatar style={{ background: '#4285F4' }} size={32}>
              {profile?.username[0]}
            </Avatar>
          )}

          <Dropdown menu={{ items: profileItems }}>
            <Space>
              <div className="flex items-center">
                <span className=" mx-2 cursor-pointer">
                  {profile?.fullName}
                </span>
                <Image className=" cursor-pointer" src={DropdownIcon} />
              </div>
            </Space>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
