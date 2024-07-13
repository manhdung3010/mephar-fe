import { getHistoryCustomer } from '@/api/trip.service';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { formatDateTime } from '@/helpers';
import { profileState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';

function TripHistory({ id }) {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
  });

  const profile = useRecoilValue(profileState);

  const { data: tripHistory, isLoading } = useQuery(
    ['CUSTOMER_TRIP_HISTORY', JSON.stringify(formFilter)],
    () => getHistoryCustomer(id),
    {
      enabled: !!id,
    }
  );

  const columns: any = [
    {
      title: 'Mã lịch trình',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => <span className="text-[#0070F4]">{record?.trip?.code}</span>,
    },
    {
      title: 'Tên lịch trình',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => record?.trip?.name,
    },
    {
      title: 'Thời gian ghé thăm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => formatDateTime(record?.visitedAt),
    },
    {
      title: 'Người ghé thăm',
      dataIndex: 'userManager',
      key: 'userManager',
      render: (value, record) => record?.trip?.userManager?.fullName,
    },

  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={tripHistory?.data?.items}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={tripHistory?.data?.totalItem}
      />
    </div>
  );
}

export default TripHistory