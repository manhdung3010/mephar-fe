import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getBranch } from '@/api/branch.service';
import { getProfile } from '@/api/user';
import { getToken } from '@/helpers/storage';
import {
  agencyState,
  branchState,
  orderActiveState,
  orderState,
  profileState,
  storeState,
} from '@/recoil/state';

const excludePath = ['/auth/sign-in'];

export function InitGlobalData() {
  const router = useRouter();

  const [, setProfileState] = useRecoilState(profileState);
  const [, setStoreState] = useRecoilState(storeState);
  const [branch, setBranch] = useRecoilState(branchState);
  const [isAgency, setIsAgency] = useRecoilState(agencyState);
  const orderObject = useRecoilValue(orderState);
  const orderActive = useRecoilValue(orderActiveState);

  const { data: profile } = useQuery(
    ['PROFILE', getToken(), router.pathname],
    () => getProfile(),
    {
      enabled: !!getToken() && !excludePath.includes(router.pathname),
    }
  );
  const { data: branches } = useQuery(
    ['SETTING_BRANCH', getToken()],
    () => getBranch(),
    {
      enabled:
        !branch && !!getToken() && !excludePath.includes(router.pathname),
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (profile) {
      setProfileState(profile.data);
      setStoreState(profile.data?.store?.id);
    }
  }, [profile]);

  useEffect(() => {
    if (branches?.data?.items?.length && !branch) {
      const defaultBranch = branches?.data?.items?.find(
        (item) => item.isDefaultBranch
      );

      setBranch(
        defaultBranch ? defaultBranch.id : branches?.data?.items[0]?.id
      );
      setIsAgency(defaultBranch ? defaultBranch.isAgency : branches?.data?.items[0]?.isAgency);
    }
  }, [branches, router.pathname]);

  return <></>;
}
