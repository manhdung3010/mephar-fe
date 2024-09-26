import React, { useEffect, useState } from 'react'
import classNames from 'classnames';
import AgencyList from './AgencyList';
import { useQuery } from '@tanstack/react-query';
import { getAllFollowStore } from '@/api/market.service';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

function Agency() {
  const branchId = useRecoilValue(branchState);
  const [select, setSelect] = useState(0);
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
    status: "",
  });

  useEffect(() => {
    setFormFilter((preValue) => ({
      ...preValue,
      status: menu[select] === 'Yêu cầu làm đại lý' ? 'pending' : 'active',
    }));
  }, [select]);

  const { data: agency, isLoading } = useQuery(
    ['AGENCY_LIST', JSON.stringify(formFilter)],
    () => getAllFollowStore({ ...formFilter }),
  );

  const menu = ['Danh sách đại lý', 'Yêu cầu làm đại lý'];
  return (
    <div>
      <div
        className="flex flex-col gap-5 bg-white px-4 pt-4 pb-5 mt-8"
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
        {select === 0 && <AgencyList formFilter={formFilter} setFormFilter={setFormFilter} data={agency?.data} isLoading={isLoading} />}
        {select === 1 && <AgencyList formFilter={formFilter} setFormFilter={setFormFilter} data={agency?.data} isLoading={isLoading} />}
      </div>
    </div>
  )
}

export default Agency