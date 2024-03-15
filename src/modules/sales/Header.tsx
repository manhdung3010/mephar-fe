import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getBranch } from '@/api/branch.service';
import BackIcon from '@/assets/backIcon.svg';
import DropdownIcon from '@/assets/dropdownIcon.svg';
import LocationIcon from '@/assets/locationIcon.svg';
import { getImage, randomString } from '@/helpers';
import LogoIcon from '@/public/logo.svg';
import {
  branchState,
  orderActiveState,
  orderState,
  profileState,
} from '@/recoil/state';

import { HeaderStyled } from './styled';

export function SaleHeader() {
  const router = useRouter();

  const [branchId, setBranch] = useRecoilState(branchState);
  const [, setOrderObject] = useRecoilState(orderState);
  const [, setOrderActive] = useRecoilState(orderActiveState);
  const profile = useRecoilValue(profileState);

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

  return (
    <HeaderStyled>
      <div className="flex h-[76px] w-full items-center justify-between py-6 px-8 shadow-[0px_2px_4px_0px_rgba(168,168,168,0.25)]">
        <div className="flex">
          <Image
            src={BackIcon}
            className=" cursor-pointer"
            onClick={() => router.back()}
            alt=""
          />

          <div className="mx-6 h-[48px] w-[1px] bg-[#E4E4E4]" />

          <Image src={LogoIcon} />
        </div>

        <div className="flex">
          <Dropdown menu={{ items }} overlayClassName="branch-menu">
            <Space>
              <div className="flex items-center rounded-[40px] bg-[#F8F9FD] px-3 py-2">
                <Image src={LocationIcon} />
                <span className=" mx-2 cursor-pointer text-[#19191C]">
                  Chi nhánh hiện tại:{' '}
                  {
                    branches?.data?.items?.find((item) => item.id === branchId)
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
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
}
