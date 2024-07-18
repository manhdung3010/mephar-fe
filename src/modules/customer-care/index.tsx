import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import All from './All';
import { CustomButton } from '@/components/CustomButton';
import Image from 'next/image';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { useQuery } from '@tanstack/react-query';
import { getAllTrip } from '@/api/trip.service';
import { useRouter } from 'next/router';
import { hasPermission } from '@/helpers';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';
import { RoleAction, RoleModel } from '../settings/role/role.enum';

function ScheduleList() {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [select, setSelect] = useState(0);
  const menu = ['Tất cả', 'Đang tiến hành', 'Đã hoàn thành'];

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: '',
    status: '',
  });

  useEffect(() => {
    setFormFilter((preValue) => ({
      ...preValue,
      status: menu[select] === 'Tất cả' ? '' : menu[select] === 'Đang tiến hành' ? 'pending' : 'done',
    }));
  }, [select]);

  const { data: trips, isLoading } = useQuery(
    ["TRIPS", JSON.stringify(formFilter)],
    () =>
      getAllTrip(formFilter),
  );
  return (
    <div>
      {
        hasPermission(profile?.role?.permissions, RoleModel.map, RoleAction.create) && (
          <div className='flex justify-end mt-3'>
            <CustomButton onClick={() => router.push('/customer-care/create-schedule')} type='danger' prefixIcon={<Image src={PlusIcon} />}>Thêm lịch trình tiếp thị</CustomButton>
          </div>
        )
      }
      <div
        className="flex flex-col gap-5 bg-white px-4 pt-4 pb-5 mt-3"
        style={{ boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)' }}
      >
        <div className="flex flex-col">
          <div className="flex gap-3">
            {menu.map((item, index) => (
              <div
                key={index}
                className={classNames(
                  'cursor-pointer px-5 py-[6px] rounded-t-lg',
                  index === select
                    ? 'bg-[#D64457] text-[white]'
                    : 'text-black-main'
                )}
                onClick={() => setSelect(index)}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="h-[1px] w-full bg-[#D64457]" />
        </div>
        {select === 0 && <All trips={trips} formFilter={formFilter} setFormFilter={setFormFilter} isLoading={isLoading} />}
        {select === 1 && <All trips={trips} formFilter={formFilter} setFormFilter={setFormFilter} isLoading={isLoading} />}
        {select === 2 && <All trips={trips} formFilter={formFilter} setFormFilter={setFormFilter} isLoading={isLoading} />}
      </div>
    </div>

  )
}

export default ScheduleList