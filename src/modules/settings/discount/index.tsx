import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EDiscountStatus, EDiscountStatusLabel } from '@/enums';

import RowDetail from './row-detail';
import Search from './Search';
import { useQuery } from '@tanstack/react-query';
import { getDiscount } from '@/api/discount.service';
import CustomPagination from '@/components/CustomPagination';
import { formatDateTime } from '@/helpers';
import { debounce } from 'lodash';

interface IRecord {
  key: number;
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  createdBy: string;
  status: EDiscountStatus;
  type: string;
}

export function Discount() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: discount, isLoading } = useQuery(
    ['promotion-program', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getDiscount(formFilter)
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã chương trình',
      dataIndex: 'id',
      key: 'id',
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Tên chương trình',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Từ ngày',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (value) => <span>{formatDateTime(value)}</span>,
    },
    {
      title: 'Đến ngày',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (value) => <span>{formatDateTime(value)}</span>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            status === EDiscountStatus.active
              ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
              : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {status === EDiscountStatus.active ? EDiscountStatusLabel.active : EDiscountStatusLabel.inactive}
        </div>
      ),
    },
    {
      title: 'Hình thức khuyến mại',
      dataIndex: 'alt',
      key: 'alt',
    },
  ];

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/settings/discount/add-discount')}
        >
          Thêm mới khuyến mại
        </CustomButton>
      </div>

      <Search onChange={debounce((value) => {
        setFormFilter((preValue) => ({
          ...preValue,
          keyword: value,
        }));
      }, 300)} />

      <CustomTable
        dataSource={discount?.data?.list_promotion_program?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => {
            return <RowDetail record={record} />;
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={discount?.data?.totalItem || 0}
      />
    </div>
  );
}
